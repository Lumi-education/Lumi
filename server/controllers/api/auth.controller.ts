import * as express from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jwt-simple';
import * as debug from 'debug';
import { assign, flatten } from 'lodash';
import * as raven from 'raven';
import { IRequest } from '../../middleware/auth';

import db from '../../db';

import ErrorResponse from '../../core/error';

import { IUser } from 'lib/users/types';
import { IAssignment } from 'lib/flow/types';

const log = debug('lumi:controller:auth');

class AuthController {
    public login(req: IRequest, res: express.Response) {
        try {
            db.view(
                'auth',
                'login',
                { key: req.body.username.toLowerCase() },
                (view_user_error, users) => {
                    if (users.length !== 1 || view_user_error) {
                        return res
                            .status(404)
                            .json(
                                new ErrorResponse(
                                    'auth',
                                    'UserNotFound',
                                    'user.not_found',
                                    view_user_error
                                )
                            );
                    }

                    const user = users[0];

                    if (!user.password) {
                        return res.status(200).json({
                            jwt_token: jwt_token(user._id, user.level),
                            _id: user._id,
                            level: user.level
                        });
                    }

                    bcrypt.compare(
                        req.body.password,
                        user.password,
                        (err, hash) => {
                            if (err || !hash) {
                                res.status(401).json(
                                    new ErrorResponse(
                                        'auth',
                                        'InvalidPassword',
                                        'auth.invalid_password'
                                    )
                                );
                            } else {
                                return res.status(200).json({
                                    jwt_token: jwt_token(user._id, user.level),
                                    _id: user._id,
                                    level: user.level
                                });
                            }
                        }
                    );
                }
            );
        } catch (error) {
            res.status(500).json(
                new ErrorResponse('auth', 'ServerError', 'server.error', error)
            );
        }
    }

    public register(req: IRequest, res: express.Response) {
        db.findOne(
            { name: req.body.name, type: 'user' },
            { limit: 1 },
            (error, user: IUser) => {
                if (user) {
                    res.status(409).end();
                } else {
                    bcrypt.hash(req.body.password, null, null, (err, pw) => {
                        db.view(
                            'groups',
                            'autojoin',
                            {},
                            (view_groups_error, groups) => {
                                const group_ids = groups.map(
                                    group => group._id
                                );

                                const new_user: IUser = {
                                    _id: undefined,
                                    _rev: undefined,
                                    type: 'user',
                                    name: 'no name',
                                    level: 0,
                                    groups: group_ids,
                                    password: pw,
                                    flow: [],
                                    _deleted: false,
                                    _attachments: {}
                                };

                                assign(new_user, req.body, { password: pw });

                                db.insert(
                                    new_user,
                                    (insert_user_error, inserted_user) => {
                                        const card_ids = flatten(
                                            groups.map(group => group.cards)
                                        );

                                        const _assignments = [];

                                        card_ids.forEach((card_id: string) => {
                                            const _assignment: IAssignment = {
                                                card_id,
                                                user_id: inserted_user._id,
                                                type: 'assignment',
                                                completed: false,
                                                data: {},
                                                state: null,
                                                archived: false,
                                                finished: null,
                                                time: null,
                                                sync: 'success',
                                                _attachments: {},
                                                files: []
                                            };

                                            _assignments.push(_assignment);
                                        });

                                        db.insertMany(
                                            _assignments,
                                            {},
                                            (
                                                insert_assignments_error,
                                                docs
                                            ) => {
                                                db.updateOne(
                                                    inserted_user._id,
                                                    {
                                                        flow: docs.map(
                                                            d => d.id
                                                        )
                                                    },
                                                    (
                                                        update_user_error,
                                                        updated_user
                                                    ) => {
                                                        db.findById(
                                                            '_design/user',
                                                            (
                                                                view_error,
                                                                view
                                                            ) => {
                                                                const new_view = add_view_to_user(
                                                                    view,
                                                                    updated_user._id
                                                                );

                                                                db.updateOne(
                                                                    '_design/user',
                                                                    new_view,
                                                                    (
                                                                        update_view_error,
                                                                        updated_view
                                                                    ) => {
                                                                        res.status(
                                                                            200
                                                                        ).json(
                                                                            updated_user
                                                                        );
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    });
                }
            }
        );
    }

    public logout(req: IRequest, res: express.Response) {
        res.status(200).end();
    }

    public get_session(req: IRequest, res: express.Response) {
        if (!req.user) {
            return res.status(401).end();
        }
        db.findById(req.user._id, (error, user) => {
            res.status(200).json(user);
        });
    }

    public set_password(req: IRequest, res: express.Response) {
        db.view(
            'auth',
            'login',
            { key: req.body.username.toLowerCase() },
            (error, docs) => {
                if (error) {
                    res.status(404).end();
                }
                if (docs.length === 1) {
                    const user = docs[0];
                    if (!user.password) {
                        bcrypt.hash(
                            req.body.password,
                            null,
                            null,
                            (err, hash) => {
                                db.updateOne(
                                    user._id,
                                    {
                                        password: hash
                                    },
                                    (updateOne_error, doc) => {
                                        res.status(200).end();
                                    }
                                );
                            }
                        );
                    } else {
                        res.status(401).end();
                    }
                } else {
                    res.status(404).end();
                }
            }
        );
    }

    public username(req: IRequest, res: express.Response) {
        db.view(
            'auth',
            'username',
            { key: req.params.username },
            (err, docs) => {
                if (err) {
                    raven.captureException(err);
                    return res.status(400).json(err);
                }
                if (docs.length === 1) {
                    const user = docs[0];

                    res.status(200).json({
                        username: req.params.username,
                        password: user.password ? true : false
                    });
                } else {
                    res.status(404).json(
                        new ErrorResponse(
                            'auth',
                            'UserNotFound',
                            'user.not_found'
                        )
                    );
                }
            }
        );
    }
}

export default AuthController;

function jwt_token(user_id: string, level: number): any {
    return jwt.encode(
        {
            level,
            _id: user_id
        },
        process.env.KEY || 'KEY'
    );
}

function add_view_to_user(_design, user_id: string) {
    const new_view = {};
    new_view[user_id] = {
        map: "function (doc) {\n  if (doc.user_id === '__USERID__') { \n    emit('__USERID__', 1); \n    if (doc.type === 'assignment') { emit('__USERID__', { _id: doc.card_id }) }\n  }\n  if (doc.type === 'user' && doc._id === '__USERID__') {\n    emit('__USERID__', 1);\n    doc.groups.forEach(function(group_id)  { emit('__USERID__', {_id: group_id })} );\n  }\n}".replace(
            /__USERID__/g,
            user_id
        )
    };
    const views = assign({}, _design.views, new_view);

    _design.views = views;
    return _design;
}

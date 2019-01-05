import * as express from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jwt-simple';
import * as debug from 'debug';
import { assign } from 'lodash';
import * as raven from 'raven';
import { IRequest } from '../../middleware/auth';

import DB from '../../db_v1';
import { IDB } from '../../db_v1/interface';

import ErrorResponse from '../../core/error';

import { IUser } from 'lib/users/types';

const log_info = debug('lumi:api:v1:auth');

class AuthController {
    public login(req: IRequest, res: express.Response) {
        try {
            const db_name = req.params.db;
            const db: IDB = new DB(req.params.db);

            const username = req.body.username.toLowerCase();

            db.view<IUser>('auth', 'login', { key: username })
                .then(body => {
                    if (body.rows.length === 0) {
                        return res
                            .status(404)
                            .json(
                                new ErrorResponse(
                                    'auth',
                                    'UserNotFound',
                                    'auth.user_not_found'
                                )
                            );
                    }

                    const user = body.rows[0].doc;

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
                                    jwt_token: jwt_token(
                                        user._id,
                                        user.level,
                                        db_name
                                    ),
                                    _id: user._id,
                                    level: user.level
                                });
                            }
                        }
                    );
                })
                .catch(error => {
                    res.status(404).json(
                        new ErrorResponse(
                            'auth',
                            'InvalidDB',
                            'auth.invalid_db',
                            error
                        )
                    );
                });
        } catch (error) {
            res.status(500).json(
                new ErrorResponse('auth', 'ServerError', 'server.error', error)
            );
        }
    }

    public username(req: IRequest, res: express.Response) {
        try {
            const db: IDB = new DB(req.params.db);

            db.view<IUser>('auth', 'username', { key: req.params.username })
                .then(body => {
                    if (body.rows.length === 0) {
                        return res.status(200).json({
                            ok: true
                        });
                    }
                    return res.status(200).json({
                        ok: false
                    });
                })
                .catch(error => {
                    return res.status(200).json({
                        ok: true
                    });
                });
        } catch (error) {
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse('auth', 'ServerError', 'auth.server.error')
            );
        }
    }

    // public register(req: IRequest, res: express.Response) {
    //     const db_name = req.params.db;
    //     const db: IDB = new DB(req.params.db);

    //     db.find<IUser>({
    //         selector: { name: req.body.name, type: 'user' },
    //         limit: 1
    //     }).then(response => {
    //         if (response.docs.length !== 0) {
    //             return res.status(409).end();
    //         }

    //         bcrypt.hash(req.body.password, null, null, (err, pw) => {
    //             const new_user: IUser = {
    //                 _id: undefined,
    //                 _rev: undefined,
    //                 type: 'user',
    //                 name: 'no name',
    //                 level: 0,
    //                 groups: [],
    //                 password: pw,
    //                 flow: [],
    //                 _deleted: false,
    //                 _attachments: {}
    //             };

    //             assign(new_user, req.body, { password: pw });

    //             db.insert<IUser>(new_user).then(insert_user_res => {
    //                 db.findById('_design/user').then(design => {
    //                     const updated_design = add_view_to_user(design, insert_user_res.id);

    //                     db.update
    //                 });

    //                 res.status(200).json({
    //                     jwt_token: jwt_token(
    //                         insert_user_res.id,
    //                         new_user.level,
    //                         db_name
    //                     ),
    //                     user: assign(new_user, {
    //                         _id: insert_user_res.id,
    //                         _rev: insert_user_res.rev
    //                     })
    //                 });
    //             });
    //         });
    //     });
    // }

    // public logout(req: IRequest, res: express.Response) {
    //     res.status(200).end();
    // }

    // public get_session(req: IRequest, res: express.Response) {
    //     if (!req.user) {
    //         return res.status(401).end();
    //     }
    //     db.findById(req.user._id, (error, user) => {
    //         res.status(200).json(user);
    //     });
    // }

    // public set_password(req: IRequest, res: express.Response) {
    //     db.view(
    //         'auth',
    //         'login',
    //         { key: req.body.username.toLowerCase() },
    //         (error, docs) => {
    //             if (error) {
    //                 res.status(404).end();
    //             }
    //             if (docs.length === 1) {
    //                 const user = docs[0];
    //                 if (!user.password) {
    //                     bcrypt.hash(
    //                         req.body.password,
    //                         null,
    //                         null,
    //                         (err, hash) => {
    //                             db.updateOne(
    //                                 user._id,
    //                                 {
    //                                     password: hash
    //                                 },
    //                                 (updateOne_error, doc) => {
    //                                     res.status(200).end();
    //                                 }
    //                             );
    //                         }
    //                     );
    //                 } else {
    //                     res.status(401).end();
    //                 }
    //             } else {
    //                 res.status(404).end();
    //             }
    //         }
    //     );
    // }
}

export default new AuthController();

function jwt_token(user_id: string, level: number, db_name: string): any {
    return jwt.encode(
        {
            level,
            _id: user_id,
            db: db_name
        },
        process.env.KEY || 'KEY'
    );
}

function add_view_to_user(_design, user_id: string): any {
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

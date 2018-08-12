import * as express from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jwt-simple';
import { assign, noop } from 'lodash';

import { IRequest } from '../../middleware/auth';

import db from '../../db';

import { IUser } from 'lib/users/types';

class AuthController {
    public login(req: IRequest, res: express.Response) {
        db.findOne(
            {
                type: 'user',
                name: req.body.username
            },
            {},
            (error, user: IUser) => {
                if (!user) {
                    return res.status(404).json({
                        message: 'user not found',
                        username: req.body.username
                    });
                }
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
                            res.status(401).end();
                        } else {
                            user.last_login = new Date();
                            db.save(user, noop);

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
    }

    public register(req: IRequest, res: express.Response) {
        db.findOne(
            { name: req.body.username, type: 'user' },
            { limit: 1 },
            (error, user: IUser) => {
                if (user) {
                    res.status(409).end();
                } else {
                    bcrypt.hash(req.body.password, null, null, (err, pw) => {
                        const new_user: IUser = {
                            _id: undefined,
                            type: 'user',
                            name: 'no name',
                            level: 0,
                            groups: [],
                            last_login: undefined,
                            last_active: undefined,
                            online: false,
                            location: '/',
                            password: pw,
                            flow: [],
                            _deleted: false
                        };

                        assign(new_user, req.body, { password: pw });

                        db.insert(new_user, (insert_error, insert_response) => {
                            db.findById(
                                insert_response.body.id,
                                (findById_error, _user) => {
                                    res.status(200).json(_user);
                                }
                            );
                        });
                    });
                }
            }
        );
    }

    public logout(req: IRequest, res: express.Response) {
        res.status(200).end();
    }

    public get_session(req: IRequest, res: express.Response) {
        db.updateOne(req.user._id, { last_active: new Date() });

        db.findById(req.user._id, (error, user) => {
            res.status(200).json(user);
        });
    }

    public set_password(req: IRequest, res: express.Response) {
        db.view(
            'auth',
            'check_username',
            { key: req.body.username },
            (error, docs) => {
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
            'check_username',
            { key: req.params.username },
            (err, docs) => {
                if (docs.length === 1) {
                    const user = docs[0];

                    res.status(200).json({
                        username: req.params.username,
                        password: user.password ? true : false
                    });
                } else {
                    res.status(404).end();
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

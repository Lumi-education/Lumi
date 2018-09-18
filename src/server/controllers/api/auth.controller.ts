import * as express from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jwt-simple';
import * as debug from 'debug';
import { assign, noop } from 'lodash';

import { IRequest } from '../../middleware/auth';

import db from '../../db';

import { IUser } from 'lib/users/types';

import { add_activity } from '../../modules/activity';

const log = debug('lumi:controller:auth');

class AuthController {
    public login(req: IRequest, res: express.Response) {
        db.view(
            'auth',
            'login',
            { key: req.body.username.toLowerCase() },
            (view_user_error, users) => {
                if (users.length !== 1 || view_user_error) {
                    return res.status(404).json({ message: 'user not found' });
                }

                const user = users[0];

                if (!user.password) {
                    add_activity(user._id, 'login', new Date());

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
                            add_activity(user._id, 'login', new Date());

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

        // db.findOne(
        //     {
        //         type: 'user',
        //         name: req.body.username
        //     },
        //     {},
        //     (error, user: IUser) => {
        //         if (!user) {
        //             return res.status(404).json({
        //                 message: 'user not found',
        //                 username: req.body.username
        //             });
        //         }
        //         if (!user.password) {
        //             return res.status(200).json({
        //                 jwt_token: jwt_token(user._id, user.level),
        //                 _id: user._id,
        //                 level: user.level
        //             });
        //         }

        //         bcrypt.compare(
        //             req.body.password,
        //             user.password,
        //             (err, hash) => {
        //                 if (err || !hash) {
        //                     res.status(401).end();
        //                 } else {
        //                     user.last_login = new Date();
        //                     db.save(user, noop);

        //                     return res.status(200).json({
        //                         jwt_token: jwt_token(user._id, user.level),
        //                         _id: user._id,
        //                         level: user.level
        //                     });
        //                 }
        //             }
        //         );
        //     }
        // );
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
        db.findById(req.user._id, (error, user) => {
            res.status(200).json(user);
        });
    }

    public set_password(req: IRequest, res: express.Response) {
        // db.find(
        //     { type: 'user', name: req.body.username },
        //     { limit: 1 },
        //     (find_user_error, users) => {
        //         if (find_user_error) {
        //             res.status(404).end();
        //         }
        //         const _user = users[0];

        //         if (!_user.password) {
        //             bcrypt.hash(req.body.password, null, null, (err, hash) => {
        //                 db.updateOne(
        //                     _user._id,
        //                     {
        //                         password: hash
        //                     },
        //                     (updateOne_error, doc) => {
        //                         res.status(200).end();
        //                     }
        //                 );
        //             });
        //         } else {
        //             res.status(401).end();
        //         }
        //     }
        // );
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
        db.find(
            { type: 'user', name: req.params.username },
            { limit: 1 },
            (find_user_error, user) => {
                if (find_user_error) {
                    res.status(404).end();
                }
                res.status(200).json({
                    username: user.name,
                    password: user.password ? true : false
                });
            }
        );
        //     db.view(
        //         'auth',
        //         'check_username',
        //         { key: req.params.username },
        //         (err, docs) => {
        //             if (docs.length === 1) {
        //                 const user = docs[0];

        // res.status(200).json({
        //     username: req.params.username,
        //     password: user.password ? true : false
        // });
        //             } else {
        //                 res.status(404).end();
        //             }
        //         }
        //     );
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

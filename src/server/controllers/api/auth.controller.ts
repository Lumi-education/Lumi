import * as express from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jwt-simple';
import { assign, noop } from 'lodash';

import { IRequest } from '../../middleware/auth';
import { DB } from '../../db';
import User from '../../models/User';
import Controller from '../controller';

import webhook from '../../core/webhook';

class AuthController extends Controller<{}> {
    constructor() {
        const _view = {
            _id: '_design/auth',
            views: {
                check_username: {
                    map:
                        'function (doc) {\n  if (doc.type === "user") { emit(doc.name, {\n    username: doc.name,\n    password: doc.password\n  }); }\n}'
                }
            },
            language: 'javascript'
        };

        super('auth', _view);
    }

    public login(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findOne(
            {
                type: 'user',
                name: req.body.username
            },
            {},
            (user: User) => {
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
            },
            User
        );
    }

    public register(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findOne(
            { name: req.body.username, type: 'user' },
            {},
            (user: User) => {
                if (user) {
                    res.status(409).end();
                } else {
                    db.insert(
                        new User({
                            name: req.body.username
                        }),
                        doc => {
                            db.insert(
                                {
                                    _id: doc.body.id + '-pw',
                                    user_id: doc.body.id,
                                    password: bcrypt.hashSync(
                                        req.body.password
                                    ),
                                    type: 'password'
                                },
                                () => {
                                    res.status(201).end();
                                }
                            );
                        }
                    );
                }
            },
            User
        );
    }

    public logout(req: IRequest, res: express.Response) {
        res.status(200).end();
    }

    public get_session(req: IRequest, res: express.Response) {
        const db = new DB(res);
        db.update_one(req.user._id, { last_active: new Date() });

        db.findById(req.user._id, user => {
            res.status(200).json(user);
        });
    }

    public set_password(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view('auth', 'check_username', { key: req.body.username }, docs => {
            if (docs.length === 1) {
                const user = docs[0];

                if (!user.password) {
                    bcrypt.hash(req.body.password, null, null, hash => {
                        db.update_one(
                            user._id,
                            {
                                password: hash
                            },
                            doc => {
                                res.status(200).end();
                            }
                        );
                    });
                } else {
                    res.status(401).end();
                }
            } else {
                res.status(404).end();
            }
        });
    }

    public username(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view(
            'auth',
            'check_username',
            { key: req.params.username },
            docs => {
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

export default new AuthController();

function jwt_token(user_id: string, level: number): any {
    return jwt.encode(
        {
            level,
            _id: user_id
        },
        process.env.KEY || 'KEY'
    );
}

import * as express from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jwt-simple';
import { assign } from 'lodash';

import { Request } from '../../middleware/auth';
import db from '../../db';
import { DB } from '../../db';
import User from '../../models/User';
import session from '../../core/session';

class AuthController {
    public login(req: Request, res: express.Response) {
        const db = new DB(res);

        db.findOne(
            {
                type: 'user',
                name: req.body.username
            },
            {},
            (user: User) => {
                db.findOne(
                    {
                        type: 'password',
                        user_id: user._id
                    },
                    {},
                    pw => {
                        if (pw) {
                            if (
                                !bcrypt.compareSync(
                                    req.body.password,
                                    pw.password
                                )
                            ) {
                                res.status(401).end();
                            } else {
                                send_auth(
                                    user._id,
                                    session.id,
                                    user.level,
                                    res
                                );
                            }
                        } else {
                            send_auth(user._id, session.id, user.level, res);
                        }
                    }
                );
            },
            User
        );
    }

    public register(req: Request, res: express.Response) {
        const db = new DB(res);

        db.findOne(
            { username: req.body.username },
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

    public logout(req: Request, res: express.Response) {
        res.status(200).end();
    }
}

export default new AuthController();

export function logout(req: Request, res: express.Response) {
    db.view(
        'user',
        'session',
        { key: [req.user._id, req.user.session_id] },
        (err, body) => {
            if (err) {
                res.status(500).json(err);
                return;
            }

            let session = body.rows[0].value;

            if (!session) {
                res.status(404).end('session not found');
                return;
            }

            session.logout = new Date().getTime();
            session.online = false;
            db.insert(session, (err, body) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }

                res.status(200).end();
            });
        }
    );
}

export function get_session_id(req: express.Request, res: express.Response) {
    res.status(200).json({ session_id: session.id });
}

export function get_session(req: Request, res: express.Response) {
    res.status(200).json(req.user);
}

export function put_session(req: Request, res: express.Response) {
    db.view(
        'user',
        'session',
        { key: [req.user._id, req.user.session_id] },
        (err, body) => {
            if (err) {
                res.status(500).json(err);
                return;
            }

            let session = body.rows[0].value;

            if (!session) {
                res.status(404).end('session not found');
                return;
            }

            assign(session, req.body);
            db.insert(session, (err, body) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }

                res.status(200).end();
            });
        }
    );
}

function send_auth(
    user_id: string,
    session_id: string,
    level: number,
    res: express.Response
): void {
    const jwt_token = jwt.encode(
        {
            _id: user_id,
            session_id,
            level
        },
        process.env.KEY || 'KEY'
    );

    res.status(200).json({
        jwt_token,
        user_id,
        level
    });
}

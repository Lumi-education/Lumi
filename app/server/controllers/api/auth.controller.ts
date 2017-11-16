import * as express from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jwt-simple';
import { assign } from 'lodash';

import { IRequest } from '../../middleware/auth';
import { DB } from '../../db';
import User from '../../models/User';

class AuthController {
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
                    res.status(404).end();
                }

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
                                send_auth(user._id, user.level, res);
                            }
                        } else {
                            send_auth(user._id, user.level, res);
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

    public logout(req: IRequest, res: express.Response) {
        res.status(200).end();
    }

    public get_session(req: IRequest, res: express.Response) {
        res.status(200).json(req.user);
    }
}

export default new AuthController();

function send_auth(
    user_id: string,
    level: number,
    res: express.Response
): void {
    const jwt_token = jwt.encode(
        {
            level,
            _id: user_id
        },
        process.env.KEY || 'KEY'
    );

    res.status(200).json({
        jwt_token,
        user_id,
        level
    });
}

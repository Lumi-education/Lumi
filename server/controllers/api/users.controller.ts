import * as express from 'express';
import * as raven from 'raven';
import { IRequest } from '../../middleware/auth';
import { assign } from 'lodash';
import ErrorResponse from '../../core/error';

import db from '../../db';

import { IUser } from 'lib/users/types';

class UsersController {
    public list(req: IRequest, res: express.Response) {
        db.view(
            'users',
            'user',
            req.query.user_ids ? { keys: JSON.parse(req.query.user_ids) } : {},
            (error, docs) => {
                if (error) {
                    raven.captureException(error);
                    return res.status(400).json(error);
                }
                res.status(200).json(docs);
            }
        );
    }

    public init(req: IRequest, res: express.Response) {
        db.view('users', 'init', { key: req.user._id }, (error, docs) => {
            if (error) {
                raven.captureException(error);
                return res.status(400).json(error);
            }
            res.status(200).json(docs);
        });
    }

    public create(req: IRequest, res: express.Response) {
        const new_user: IUser = {
            _id: undefined,
            type: 'user',
            name: 'no name',
            level: 2,
            groups: [],
            last_login: undefined,
            last_active: undefined,
            online: false,
            location: '/',
            password: undefined,
            flow: [],
            _deleted: false
        };

        db.view(
            'auth',
            'username',
            { key: req.body.name },
            (view_user_error, users) => {
                if (users.length > 0) {
                    return res.status(409).json({ message: 'username_exists' });
                }

                assign(new_user, req.body, { password: undefined });

                db.insert(new_user, (error, user) => {
                    res.status(200).json(user);
                });
            }
        );
    }

    public read(req: IRequest, res: express.Response) {
        db.findById(req.params.id, (error, user) => {
            if (error) {
                return res
                    .status(error.status)
                    .json(
                        new ErrorResponse(
                            'users',
                            'UserNotFound',
                            'user.not_found',
                            error
                        )
                    );
            }

            res.status(200).json(user);
        });
        // db.view('users', 'user', { key: req.params.id }, (error, docs) => {
        //     if (error) {
        //         raven.captureException(error);
        //         return res.status(400).json(error);
        //     }
        //     res.status(200).json(docs);
        // });
    }

    public update(req: IRequest, res: express.Response) {
        db.updateOne(req.params.id, req.body, (err, updated_doc) => {
            res.status(200).json(updated_doc);
        });
    }

    public update_myself(req: IRequest, res: express.Response) {
        const user_id = req.user._id;

        const update = {
            language: req.body.language
        };

        db.updateOne(user_id, update, (err, updated_doc) => {
            res.status(200).json(updated_doc);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        const user_ids = req.body.user_ids;

        const deleted_users = user_ids.map(user_id => {
            return {
                _id: user_id,
                type: 'user',
                deleted: true
            };
        });

        db.find(
            { type: 'user', _id: { $in: user_ids } },
            { limit: user_ids.length },
            (find_users_error, users) => {
                users.forEach(user => (user._deleted = true));
                db.updateMany(users, {}, (delete_user_error, docs) => {
                    res.status(200).json([...deleted_users]);
                });
            }
        );
    }
}

export default UsersController;

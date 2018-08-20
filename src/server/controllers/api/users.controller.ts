import * as express from 'express';
import * as raven from 'raven';
import { IRequest } from '../../middleware/auth';
import { assign } from 'lodash';

import db from '../../db';

import { IUser } from 'lib/users/types';

class UsersController {
    public list(req: IRequest, res: express.Response) {
        db.find({ type: 'user' }, { limit: 100 }, (find_users_error, users) => {
            res.status(200).json(users);
        });
        // db.view('user', 'list', req.query, (error, docs) => {
        //     res.status(200).json(docs);
        // });
    }

    public create(req: IRequest, res: express.Response) {
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
            password: undefined,
            flow: [],
            _deleted: false
        };

        assign(new_user, req.body, { password: undefined });

        db.insert(new_user, (error, user) => {
            res.status(200).json(user);
        });
    }

    public read(req: IRequest, res: express.Response) {
        db.findById(req.params.id, (find_user_error, user) => {
            res.status(200).json([user]);
        });
        // db.view(
        //     'user',
        //     'with_groups',
        //     { key: req.params.id },
        //     (error, docs) => {
        //         res.status(200).json(docs);
        //     }
        // );
    }

    public update(req: IRequest, res: express.Response) {
        db.updateOne(req.params.id, req.body, (err, updated_doc) => {
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
                    db.find(
                        { type: 'group', members: { $in: user_ids } },
                        {},
                        (find_groups_error, groups) => {
                            groups.forEach(
                                group =>
                                    (group.members = group.members.filter(
                                        user_id =>
                                            user_ids.indexOf(user_id) === -1
                                    ))
                            );
                            db.updateMany(
                                groups,
                                {},
                                (update_groups_error, updated_groups) => {
                                    res.status(200).json([
                                        ...groups,
                                        ...deleted_users
                                    ]);
                                }
                            );
                        }
                    );
                });
            }
        );
    }
}

export default UsersController;

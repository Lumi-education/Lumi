import * as express from 'express';
import * as raven from 'raven';
import { uniq, assign } from 'lodash';
import { IRequest } from '../../middleware/auth';

import db from '../../db';

import { IUser } from 'lib/users/types';
import { IGroup } from 'lib/groups/types';
import {
    USERS_UPDATE_USER_ERROR,
    USERS_ADD_GROUP_ERROR
} from 'lib/users/actions';

class GroupController {
    public list(req: IRequest, res: express.Response) {
        db.view('group', 'list', {}, (error, docs) => {
            res.status(200).json(docs);
        });
    }

    public create(req: IRequest, res: express.Response) {
        const new_group: IGroup = {
            _id: undefined,
            type: 'group',
            name: 'no name',
            created_at: new Date(),
            members: []
        };

        assign(new_group, req.body);

        db.insert(new_group, (error, group) => {
            res.status(200).json(group);
        });
    }

    public read(req: IRequest, res: express.Response) {
        db.findById(req.params.id, (error, group) => {
            res.status(200).json([group]);
        });
    }

    public update(req: IRequest, res: express.Response) {
        db.updateOne(req.params.id, req.body, (err, updated_doc) => {
            res.status(200).json(updated_doc);
        });
    }

    public for_user(req: IRequest, res: express.Response) {
        db.view(
            'group',
            'for_user',
            { key: req.params.user_id },
            (error, docs) => {
                res.status(200).json(docs);
            }
        );
    }

    public delete(req: IRequest, res: express.Response) {
        db.find(
            {
                groups: { $in: [req.params.id] },
                type: 'user'
            },
            { limit: 1000 },
            (error, users: IUser[]) => {
                users.map(user =>
                    user.groups.filter(group_id => group_id !== req.params.id)
                );

                db.insertMany(users, {}, () => {
                    db.delete(req.params.id, err => {
                        res.status(200).end();
                    });
                });
            }
        );
    }

    public assign(req: IRequest, res: express.Response) {
        const user_ids = req.body.user_ids;
        const group_ids = req.body.group_ids;

        db.find(
            { type: 'user', _id: { $in: user_ids } },
            { limit: user_ids.length },
            (find_user_error, users: IUser[]) => {
                users.forEach(user => {
                    if (!user.groups) {
                        user.groups = [];
                    }
                    user.groups = uniq([...user.groups, ...group_ids]);
                });
                db.updateMany(
                    users,
                    {},
                    (update_users_error, updated_users) => {
                        db.find(
                            { type: 'group', _id: { $in: group_ids } },
                            { limit: group_ids.length },
                            (find_group_error, groups) => {
                                groups.forEach(
                                    group =>
                                        (group.members = uniq([
                                            ...group.members,
                                            ...user_ids
                                        ]))
                                );

                                db.updateMany(
                                    groups,
                                    {},
                                    (update_group_error, updated_groups) => {
                                        res.status(200).json([
                                            ...groups,
                                            ...users
                                        ]);
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }

    public action(req: IRequest, res: express.Response) {
        try {
            db.findById(req.params.id, (find_group_error, group) => {
                switch (req.body.type) {
                    case 'ADD_USER_TO_GROUP':
                        // store group_id in user-entry
                        db.findById(req.body.payload.user_id, (error, user) => {
                            user.groups = uniq([...user.groups, req.params.id]);

                            db.updateOne(
                                user._id,
                                user,
                                (update_error, updated_user) => {
                                    // add user to group-members (see group-types, why members field is used)

                                    group.members.push(user._id);

                                    db.updateOne(
                                        group._id,
                                        group,
                                        (group_update_error, updated_group) => {
                                            res.status(200).json({
                                                group: updated_group,
                                                user: updated_user
                                            });
                                        }
                                    );
                                }
                            );
                        });

                        break;
                    case 'REM_USER_FROM_GROUP':
                        db.findById(req.body.payload.user_id, (error, user) => {
                            user.groups = uniq(
                                user.groups.filter(
                                    group_id => group_id !== req.params.id
                                )
                            );

                            db.updateOne(
                                user._id,
                                user,
                                (user_updated_error, updated_user) => {
                                    group.members = group.members.filter(
                                        user_id =>
                                            user_id !== req.body.payload.user_id
                                    );
                                    db.updateOne(
                                        req.params.id,
                                        group,
                                        (update_group_error, updated_group) => {
                                            res.status(200).json({
                                                group: updated_group,
                                                user: updated_user
                                            });
                                        }
                                    );
                                }
                            );
                        });
                        break;
                    default:
                        break;
                }
            });
        } catch (err) {
            raven.captureException(err);
            res.status(500).json(err);
        }
    }
}

export default GroupController;

import * as express from 'express';
import * as raven from 'raven';
import { uniq, assign } from 'lodash';
import { IRequest } from '../../middleware/auth';

import db from '../../db';
import event from '../../core/event';

import { IUser } from 'lib/users/types';
import { IGroup } from 'lib/groups/types';
import {
    USERS_UPDATE_USER_ERROR,
    USERS_ADD_GROUP_ERROR
} from 'lib/users/actions';

class GroupController {
    public list(req: IRequest, res: express.Response) {
        db.find(
            { type: 'group' },
            { limit: 25 },
            (find_groups_error, groups) => {
                res.status(200).json(groups);
            }
        );
    }

    public create(req: IRequest, res: express.Response) {
        const new_group: IGroup = {
            _id: undefined,
            type: 'group',
            name: 'no name',
            created_at: new Date(),
            autojoin: false,
            cards: []
        };

        db.find(
            { type: 'group', name: req.body.name },
            { limit: 1 },
            (find_group_error, group) => {
                if (group.length > 0) {
                    return res.status(409).json({ message: 'group_exists' });
                }

                assign(new_group, req.body);

                db.insert(new_group, (error, _group) => {
                    res.status(200).json(_group);
                });
            }
        );
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
        db.findById(req.params.user_id, (find_user_error, user) => {
            db.find(
                { type: 'group', _id: { $in: user.groups } },
                { limit: user.groups.length },
                (find_groups_error, groups) => {
                    res.status(200).json(groups);
                }
            );
        });
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

    public assign_users_to_groups(req: IRequest, res: express.Response) {
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
                        user_ids.forEach(user_id => {
                            group_ids.forEach(group_id => {
                                event.emit(
                                    'GROUPS/USER_ASSIGNED',
                                    group_id,
                                    user_id
                                );
                            });
                        });
                        res.status(200).json([...users]);
                    }
                );
            }
        );
    }

    public remove_users_from_groups(req: IRequest, res: express.Response) {
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
                    user.groups = user.groups.filter(
                        group_id => group_ids.indexOf(group_id) === -1
                    );
                });
                db.updateMany(
                    users,
                    {},
                    (update_users_error, updated_users) => {
                        res.status(200).json([...users]);
                    }
                );
            }
        );
    }

    public add_cards(req: IRequest, res: express.Response) {
        const { group_id, card_ids } = req.body;

        db.findById(group_id, (find_group_error, group) => {
            group.cards = [...group.cards, ...card_ids];

            db.updateOne(
                group_id,
                group,
                (update_group_error, updated_group) => {
                    event.emit('GROUPS/CARDS_ADDED', group_id, card_ids);
                    res.status(200).json([updated_group]);
                }
            );
        });
    }
}

export default GroupController;

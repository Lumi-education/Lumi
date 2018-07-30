import * as express from 'express';
import * as raven from 'raven';
import {noop, uniq} from 'lodash';
import {IRequest} from '../../middleware/auth';

import Group from '../../models/Group';
import User from '../../models/User';

import {DB} from '../../db';

import Controller from '../controller';

class GroupController extends Controller<Group> {
    constructor() {
        super('group');
    }
    public list(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view('group', 'list', {}, docs => {
            res.status(200).json(docs);
        });
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Group(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view(
            'group',
            'with_collections_and_users',
            {key: req.params.id},
            docs => {
                res.status(200).json(docs);
            }
        );
    }

    public for_user(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view('group', 'for_user', {key: req.params.user_id}, docs => {
            res.status(200).json(docs);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.find(
            {
                groups: {$in: [req.params.id]},
                type: 'user'
            },
            {limit: 1000},
            (users: User[]) => {
                users.forEach(user => {
                    user.rem_group(req.params.id);
                    db.save(user, noop);
                });
            },
            User
        );

        db.delete(req.params.id);
    }

    public action(req: IRequest, res: express.Response) {
        try {
            const db = new DB(res);

            db.findById(
                req.params.id,
                (group: Group) => {
                    switch (req.body.type) {
                        case 'ADD_USER_TO_GROUP':
                            db.findById(req.body.payload.user_id, user => {
                                user.groups = uniq([
                                    ...user.groups,
                                    req.params.id
                                ]);

                                if (!user.flow) {
                                    user.flow = {};
                                }

                                user.flow[req.params.id] = [];

                                db.update_one(user._id, user);
                            });

                            break;
                        case 'REM_USER_FROM_GROUP':
                            db.findById(req.body.payload.user_id, user => {
                                user.groups = uniq(
                                    user.groups.filter(
                                        group_id => group_id !== req.params.id
                                    )
                                );

                                user.flow[req.params.id] = undefined;

                                db.update_one(user._id, user);
                            });

                            break;
                        case 'ADD_COLLECTION':
                            throw new Error(
                                'GROUPS/ACTIONS/ADD_COLLECTION is deprecated. -> Use USERS/ACTIONS/ASSIGN_COLLECTION'
                            );

                        // group.add_collection(req.body.payload.collection_id);

                        // group.get_users(db, (users: IUser[]) => {
                        //     users.forEach(user =>
                        //         assign_collection(
                        //             db,
                        //             user._id,
                        //             req.body.payload.collection_id,
                        //             req.body.payload.is_graded,
                        //             noop
                        //         )
                        //     );
                        // });

                        // db.save(group);
                        case 'REM_COLLECTION':
                            group.rem_collections(
                                req.body.payload.collection_ids
                            );
                            db.save(group);
                            break;
                        case 'ENABLE_COLLECTION':
                            group.enable_collection(
                                req.body.payload.collection_id
                            );
                            db.save(group);
                            break;
                        case 'DISABLE_COLLECTION':
                            group.disable_collection(
                                req.body.payload.collection_id
                            );
                            db.save(group);
                            break;
                        default:
                            break;
                    }
                },
                Group
            );
        } catch (err) {
            raven.captureException(err);
            res.status(500).json(err);
        }
    }
}

export default GroupController;

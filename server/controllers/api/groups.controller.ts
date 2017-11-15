import * as express from 'express';
import { noop } from 'lodash';
import { IRequest } from '../../middleware/auth';

import Group from '../../models/Group';
import User from '../../models/User';
import Collection from '../../models/Collection';

import { DB } from '../../db';

import Controller from '../controller';

class GroupController extends Controller<Group> {
    public list(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.find({ type: 'group' }, req.query, (groups: Group[]) => {
            res.status(200).json({ groups });
        });
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Group(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findById(req.params.id, (group: Group) => {
            db.find(
                { groups: { $in: [req.params.id] } },
                {},
                (users: User[]) => {
                    db.find(
                        { _id: { $in: group.assigned_collections } },
                        {},
                        (collections: Collection[]) => {
                            res.status(200).json({
                                users,
                                collections,
                                groups: [group]
                            });
                        },
                        Collection
                    );
                },
                User
            );
        });
    }

    public for_user(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findById(
            req.params.user_id,
            (user: User) => {
                user.get_groups(db, (groups: Group[]) => {
                    res.status(200).json(groups);
                });
            },
            User
        );
    }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.find(
            {
                groups: { $in: [req.params.id] },
                type: 'user'
            },
            { limit: 1000 },
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
        const db = new DB(res);

        db.findById(
            req.params.id,
            (group: Group) => {
                switch (req.body.type) {
                    case 'ADD_COLLECTION':
                        group.add_collection(req.body.payload.collection_id);
                        db.save(group);
                        break;
                    case 'REM_COLLECTION':
                        group.rem_collection(req.body.payload.collection_id);
                        db.save(group);
                        break;
                    default:
                        break;
                }
            },
            Group
        );
    }
}

export default new GroupController('group');

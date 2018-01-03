import * as express from 'express';
import { noop } from 'lodash';
import { IRequest } from '../../middleware/auth';

import { IGroupRef } from 'client/packages/groups/types';
import Group from '../../models/Group';
import User from '../../models/User';
import Collection from '../../models/Collection';

import { DB } from '../../db';

import Controller from '../controller';

class GroupController extends Controller<Group> {
    constructor() {
        const _view = {
            _id: '_design/group',
            views: {
                for_user: {
                    map:
                        'function (doc) {\n  if (doc.type === "group_ref") { \n    emit(doc.user_id, 1);\n    doc.groups.forEach(function(group_id) { emit(doc.user_id, { _id: group_id}); })\n  }\n}'
                },
                list: {
                    map:
                        'function (doc) {\n  if (doc.type === "group") { emit(doc._id, 1); }\n}'
                },
                with_collections_and_users: {
                    map:
                        'function (doc) {\n  if (doc.type === "group") {\n    emit(doc._id, 1);\n    doc.assigned_collections.forEach(function(collection_id) {\n      emit(doc._id, { _id: collection_id });\n    });\n  }\n  if (doc.type === "group_ref") {\n    doc.groups.forEach(function(group_id) { emit(group_id, { _id: doc._id })});\n  }\n}'
                }
            },
            language: 'javascript'
        };

        super('group', _view);
    }
    public list(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.view('group', 'list', {}, docs => {
            res.status(200).json(docs);
        });
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.insert(new Group(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.view(
            'group',
            'with_collections_and_users',
            { key: req.params.id },
            docs => {
                res.status(200).json(docs);
            }
        );
    }

    public for_user(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.view('group', 'for_user', { key: req.params.user_id }, docs => {
            res.status(200).json(docs);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

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
        const db = new DB(res, req.params.db);

        db.findById(
            req.params.id,
            (group: Group) => {
                switch (req.body.type) {
                    case 'ADD_USER_TO_GROUP':
                        db._findById(
                            req.body.payload.user_id + '-groups',
                            (err, group_ref: IGroupRef) => {
                                if (err) {
                                    const _group_ref: IGroupRef = {
                                        _id:
                                            req.body.payload.user_id +
                                            '-groups',
                                        user_id: req.body.payload.user_id,
                                        groups: [req.params.id],
                                        type: 'group_ref'
                                    };
                                    db.insert(_group_ref);
                                } else {
                                    group_ref.groups.push(req.params.id);
                                    db.save(group_ref);
                                }
                            }
                        );
                        break;
                    case 'REM_USER_FROM_GROUP':
                        db.findById(
                            req.body.payload.user_id + '-groups',
                            (group_ref: IGroupRef) => {
                                group_ref.groups = group_ref.groups.filter(
                                    group_id => group_id !== req.params.id
                                );
                                db.save(group_ref);
                            }
                        );
                        break;
                    case 'ADD_COLLECTION':
                        group.add_collection(req.body.payload.collection_id);
                        db.save(group);
                        break;
                    case 'REM_COLLECTION':
                        group.rem_collection(req.body.payload.collection_id);
                        db.save(group);
                        break;
                    case 'ENABLE_COLLECTION':
                        group.enable_collection(req.body.payload.collection_id);
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
    }
}

export default new GroupController();

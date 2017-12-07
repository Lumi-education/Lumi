import * as express from 'express';
import { IRequest } from '../../middleware/auth';
import * as bcrypt from 'bcrypt-nodejs';
import { assign } from 'lodash';

import User from '../../models/User';
import Group from '../../models/Group';
import { DB } from '../../db';

import Controller from '../controller';

class UserController extends Controller<User> {
    constructor() {
        const _view = {
            _id: '_design/user',
            views: {
                with_groups: {
                    map:
                        'function (doc) {\n  if (doc.type === "user") { \n    emit(doc._id, 1);\n    doc.groups.forEach(function(group_id) {\n      emit(doc._id, {_id: group_id});\n    })\n  }\n}'
                },
                list: {
                    map:
                        'function (doc) {\n  if (doc.type === "user") { emit(doc._id, 1); }\n}'
                }
            },
            language: 'javascript'
        };

        super('user', _view);
    }
    public list(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view('user', 'list', req.query, docs => {
            res.status(200).json(docs);
        });
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view('user', 'with_groups', { key: req.params.id }, docs => {
            res.status(200).json(docs);
        });
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(
            new User(assign({}, req.body, { password: undefined })),
            ({ body }) => {
                if (req.body.password) {
                    db.insert(
                        {
                            user_id: body.id,
                            password: bcrypt.hashSync(req.body.password),
                            type: 'password'
                        },
                        () => {
                            res.status(201).end();
                        }
                    );
                }
            }
        );
    }

    public action(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findById(
            req.params.id,
            (user: User) => {
                switch (req.body.type) {
                    case 'ADD_GROUP':
                        user.add_group(req.body.payload.group_id);
                        db.save(user);
                        break;
                    case 'REM_GROUP':
                        user.rem_group(req.body.payload.group_id);
                        db.save(user);
                        break;
                    default:
                        break;
                }
            },
            User
        );
    }
}

export default new UserController();

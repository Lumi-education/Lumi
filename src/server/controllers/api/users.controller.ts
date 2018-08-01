import * as express from 'express';
import * as raven from 'raven';
import {IRequest} from '../../middleware/auth';
import {assign} from 'lodash';

import db from '../../db';

import {IUser} from 'lib/users/types';

class UsersController {
    public list(req: IRequest, res: express.Response) {
        db.view('user', 'list', req.query, (error, docs) => {
            res.status(200).json(docs);
        });
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
            flow: []
        };

        assign(new_user, req.body, {password: undefined});

        db.insert(new_user, (error, user) => {
            res.status(200).json(user);
        });
    }

    public read(req: IRequest, res: express.Response) {
        db.view('user', 'with_groups', {key: req.params.id}, (error, docs) => {
            res.status(200).json(docs);
        });
    }

    public update(req: IRequest, res: express.Response) {
        db.updateOne(req.params.id, req.body, (err, updated_doc) => {
            res.status(200).json(updated_doc);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        db.delete(req.params.id, err => {
            res.status(200).end();
        });
    }

    public init(req: IRequest, res: express.Response) {
        try {
            db.view('user', 'init', {key: req.params.id}, (error, docs) =>
                res.status(200).json(docs)
            );
        } catch (err) {
            res.status(500).json(err);
            raven.captureException(err);
        }
    }
}

export default UsersController;

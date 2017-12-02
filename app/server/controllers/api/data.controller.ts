import * as express from 'express';
import { assign, isEqual } from 'lodash';
import * as debug from 'debug';
import { IRequest } from '../../middleware/auth';

import Data from '../../models/Data';
import { DB } from '../../db';

import Controller from '../controller';

const log = debug('lumi:controllers:data');

class DataController extends Controller<Data> {
    constructor() {
        log('entering constructor');
        const _view = {
            _id: '_design/data',
            views: {
                for_user: {
                    map:
                        "function (doc) {\n  if (doc.type === 'data') { \n  emit(doc.user_id, 1);\n  }\n}"
                },
                for_user_and_collection: {
                    map:
                        "function (doc) {\n  if (doc.type === 'data') { \n  emit(doc.user_id+doc.collection_id, 1);\n  }\n}"
                },
                for_user_and_collection_and_card: {
                    map:
                        "function (doc) {\n  if (doc.type === 'data') { \n  emit(doc.user_id+doc.collection_id+doc.card_id, 1);\n  }\n}"
                }
            },
            language: 'javascript'
        };
        super('data', _view);
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Data(req.body));
    }

    public forUserAndCollection(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view(
            'data',
            'for_user_and_collection',
            { key: req.user._id + req.params.collection_id },
            docs => {
                res.status(200).json(docs);
            }
        );
    }

    public find(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.find(
            assign(
                {},
                {
                    type: 'data',
                    user_id: req.user.level <= 1 ? req.user._id : undefined
                },
                req.query
            ),
            {},
            (data: Data[]) => {
                res.status(200).json(data);
            },
            Data
        );
    }
}

export default new DataController();

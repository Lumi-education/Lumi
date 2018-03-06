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
        super('data');
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Data(req.body));
    }

    public submit_collection(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findOne(
            {
                type: 'data',
                data_type: 'collection',
                user_id: req.user._id,
                collection_id: req.body.collection_id
            },
            {},
            collection_data => {
                collection_data.submitted = true;
                collection_data.submit_date = new Date();

                db.save(collection_data);
            }
        );
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
            { limit: 900 },
            (data: Data[]) => {
                res.status(200).json(data);
            },
            Data
        );
    }
}

export default DataController;

import * as express from 'express';
import { assign } from 'lodash';
import { DB } from '../../db';
import { IRequest } from '../../middleware/auth';

import * as CollectionActions from '../../modules/collections/actions';
import * as CardActions from '../../modules/cards/actions';

export class CoreController {
    public find(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.find(req.body.selector, req.body.options || {}, docs =>
            res.status(200).json(docs)
        );
    }

    public doc(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findById(req.params.id, doc => res.status(200).json([doc]));
    }

    public update(req: IRequest, res: express.Response) {
        const db = new DB(res);

        JSON.parse(req.params.ids).forEach(id => {
            db.update_one(id, req.body);
        });

        res.status(200).end();
    }

    public action(req: IRequest, res: express.Response) {
        const db = new DB(res);

        const ids = JSON.parse(req.query.ids);
        const payload = req.body;

        switch (req.params.action) {
            case 'COMPLETE_COLLECTION':
                ids.forEach(id => CollectionActions.complete_collection(id));
                res.status(200).end();
                break;
            case 'UNCOMPLETE_COLLECTION':
                ids.forEach(id => CollectionActions.uncomplete_collection(id));
                res.status(200).end();
                break;
            case 'SUBMIT_COLLECTION':
                ids.forEach(id => CollectionActions.submit_collection(id));
                res.status(200).end();
                break;
            case 'UNSUBMIT_COLLECTION':
                ids.forEach(id => CollectionActions.unsubmit_collection(id));
                res.status(200).end();
                break;
            case 'DELETE_ASSIGNMENT':
                ids.forEach(id => CollectionActions.delete_assignment(id));
                res.status(200).end();
                break;
            case 'CREATE_CARD_DATA':
                CardActions.create_card_data(
                    payload.user_id,
                    payload.collection_id,
                    payload.card_id,
                    _res => {
                        db.findById(_res.body.id, doc => {
                            res.status(200).json(doc);
                        });
                    }
                );
        }
    }
}

export default new CoreController();

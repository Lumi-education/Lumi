import * as express from 'express';
import { assign } from 'lodash';
import { DB } from '../../db';
import { IRequest } from '../../middleware/auth';

import * as CollectionActions from '../../modules/collections/actions';

export class CoreController {
    public find(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.find(req.body.selector, {}, docs => res.status(200).json(docs));
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

        switch (req.params.action) {
            case 'SUBMIT_COLLECTION':
                ids.forEach(id => CollectionActions.submit_collection(id));
                break;
            case 'DELETE_ASSIGNMENT':
                ids.forEach(id => CollectionActions.delete_assignment(id));
                break;
        }

        res.status(200).end();
    }
}

export default new CoreController();

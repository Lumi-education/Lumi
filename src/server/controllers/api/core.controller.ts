import * as express from 'express';
import { assign } from 'lodash';
import { DB } from '../../db';
import { IRequest } from '../../middleware/auth';

export class CoreController {
    public find(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.find(req.body.selector, {}, docs => res.status(200).json(docs));
    }
}

export default new CoreController();

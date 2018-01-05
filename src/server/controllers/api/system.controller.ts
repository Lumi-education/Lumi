import * as express from 'express';
import { noop } from 'lodash';
import { IRequest } from '../../middleware/auth';

import { DB } from '../../db';

class SystemController {
    public checkDb(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.checkDb(_db => {
            if (_db) {
                res.status(200).end();
            }
        });
    }
}

export default new SystemController();

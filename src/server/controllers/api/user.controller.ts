import * as express from 'express';
import { assign } from 'lodash';
import { DB } from '../../db';
import { IRequest } from '../../middleware/auth';
import * as raven from 'raven';

import User from '../../models/User';
import Group from '../../models/Group';
import Collection from '../../models/Collection';
import Data from '../../models/Data';

export class UserController {
    public createData(req: IRequest, res: express.Response) {
        const db = new DB(res);

        raven.captureException(new Error('data not found'), { req });

        db.insert(new Data(assign({}, { user_id: req.user._id }, req.body)));
    }

    public updateData(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.update_one(req.params.id, req.body, (data: Data) => {
            res.status(200).json(data);
        });
    }
}

export default new UserController();

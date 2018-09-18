import * as express from 'express';
import * as raven from 'raven';
import { IRequest } from '../../middleware/auth';

import db from '../../db';

export default class ActivityController {
    public index(req: IRequest, res: express.Response) {
        db.view('activity', 'index', {}, (activity_error, activities) => {
            if (activity_error) {
                raven.captureException(activity_error);
                return res.status(400).json(activity_error);
            }
            res.status(200).json(activities);
        });
    }
}

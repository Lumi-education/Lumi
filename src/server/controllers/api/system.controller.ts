import * as express from 'express';
import { assign } from 'lodash';
import { IRequest } from '../../middleware/auth';

import proxy from '../../core/proxy';

import Controller from '../controller';
import { DB } from '../../db';

class SystemController {
    public shutdown(req: express.Request, res: express.Response) {
        proxy.web(req, res, {
            target: 'http://localhost:' + process.env.SYSTEM_PORT + '/api/v0/'
        });
    }

    public settings(req: express.Request, res: express.Response) {
        const db = new DB();

        db.findById('system', system => {
            res.status(200).json(
                assign(
                    {
                        changes_port: process.env.CHANGES_PORT
                    },
                    system
                )
            );
        });
    }
}

export default SystemController;

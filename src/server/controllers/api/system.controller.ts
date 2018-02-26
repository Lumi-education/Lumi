import * as express from 'express';
import { IRequest } from '../../middleware/auth';

import proxy from '../../core/proxy';

import Controller from '../controller';

class SystemController {
    public shutdown(req: express.Request, res: express.Response) {
        proxy.web(req, res, {
            target: 'http://localhost:' + process.env.SYSTEM_PORT + '/api/v0/'
        });
    }

    public settings(req: express.Request, res: express.Response) {
        res.status(200).json({
            changes_port: process.env.CHANGES_PORT
        });
    }
}

export default SystemController;

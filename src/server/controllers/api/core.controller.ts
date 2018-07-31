import * as express from 'express';
import {assign} from 'lodash';
import {DB} from '../../db';
import {IRequest} from '../../middleware/auth';
import proxy from '../../core/proxy';

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

export default CoreController;

import * as express from 'express';
import {assign} from 'lodash';
import {IRequest} from '../../middleware/auth';

import proxy from '../../core/proxy';
import db from '../../db';

export class CoreController {
    public find(req: IRequest, res: express.Response) {
        db.find(req.body.selector, req.body.options || {}, (error, docs) =>
            res.status(200).json(docs)
        );
    }

    public doc(req: IRequest, res: express.Response) {
        db.findById(req.params.id, (error, doc) => res.status(200).json([doc]));
    }

    public update(req: IRequest, res: express.Response) {
        JSON.parse(req.params.ids).forEach(id => {
            db.updateOne(id, req.body, (error, doc) => {
                res.status(200).json(doc);
            });
        });
    }

    public shutdown(req: express.Request, res: express.Response) {
        proxy.web(req, res, {
            target: 'http://localhost:' + process.env.SYSTEM_PORT + '/api/v0/'
        });
    }

    public settings(req: express.Request, res: express.Response) {
        db.findById('system', (error, system) => {
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

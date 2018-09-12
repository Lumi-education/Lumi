import * as express from 'express';
import { assign } from 'lodash';
import { IRequest } from '../../middleware/auth';
import * as path from 'path';

import * as mkdirp from 'mkdirp';
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

    public upload(req: any, res: express.Response) {
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const uploaded_file = req.files.file;

        mkdirp(path.resolve('build/files') + '/' + req.query.path, error => {
            uploaded_file.mv(
                path.resolve('build/files') +
                    '/' +
                    req.query.path +
                    '/' +
                    uploaded_file.name,
                err => {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    res.send('File uploaded!');
                }
            );
        });

        // Use the mv() method to place the file somewhere on your server
    }

    public ping(req: express.Request, res: express.Response) {
        res.status(200).end('pong');
    }
}

export default CoreController;

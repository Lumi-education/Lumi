import * as express from 'express';
import { assign } from 'lodash';
import { IRequest } from '../../middleware/auth';
import * as path from 'path';
import * as request from 'superagent';

import * as mkdirp from 'mkdirp';
import db from '../../db';
import Host from '../../core/host';
import * as raven from 'raven';
import * as envfile from 'envfile';
import * as fs from 'fs';

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
        db.updateOne(req.query.id, req.body, (error, doc) => {
            res.status(200).json([doc]);
        });
    }

    public shutdown(req: express.Request, res: express.Response) {
        Host.exec('sudo shutdown -h 0', (error, msg) => {
            if (error) {
                return res.status(400).json(error);
            }

            res.status(200).json(msg);
        });
    }

    public settings(req: express.Request, res: express.Response) {
        db.findById('system', (error, system) => {
            res.status(200).json(
                assign(
                    {
                        port: process.env.PORT,
                        ip: Host.get_ip_address(),
                        target: process.env.TARGET
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

        db.saveAttachment(
            req.query.path,
            uploaded_file.name,
            uploaded_file.data,
            uploaded_file.mimetype,
            (error, success) => {
                res.status(200).end();
            }
        );
    }

    public ping(req: express.Request, res: express.Response) {
        res.status(200).end('pong');
    }

    public env(req: express.Request, res: express.Response) {
        envfile.parseFile(path.resolve('') + '/.env', (error, env) => {
            if (error) {
                raven.captureException(error);
                return res.status(400).json(error);
            }

            res.status(200).json(env);
        });
    }

    public update_env(req: express.Request, res: express.Response) {
        envfile.stringify(req.body, (err, str) => {
            if (err) {
                raven.captureException(err);
                return res.status(400).json(err);
            }

            fs.writeFile(path.resolve('') + '/.env', str, fs_write_err => {
                if (fs_write_err) {
                    raven.captureException(fs_write_err);
                    return res.status(400).json(fs_write_err);
                }

                Host.exec(
                    'cd /lumi && sudo docker-compose up -d',
                    (error, msg) => {
                        if (error) {
                            return res.status(400).json(error);
                        }

                        res.status(200).json(msg);
                    }
                );
            });
        });
    }

    public check_update(req: express.Request, res: express.Response) {
        request
            .get(
                'https://api.github.com/repos/Lumieducation/Lumi/releases/latest'
            )
            .then(github_response => {
                res.status(200).json(github_response.body);
            })
            .catch(github_error => {
                res.status(400).json(github_error);
            });
    }

    public update_system(req: express.Request, res: express.Response) {
        Host.exec('sudo curl update.lumi.education | sh', (error, msg) => {
            if (error) {
                return res.status(400).json(error);
            }

            res.status(200).json(msg);
        });
    }

    public ip_address(req: express.Request, res: express.Response) {
        res.status(200).end(Host.get_ip_address());
    }

    public get_attachment(req: any, res: express.Response) {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        db.findById(req.params.id, (find_error, doc) => {
            db.getAttachment(
                req.params.id,
                req.params.attachment,
                (err, attachment) => {
                    const attachment_info = doc._attachments
                        ? doc._attachments[req.params.attachment]
                        : undefined;

                    if (!attachment_info) {
                        return res.status(404).end();
                    }

                    const type = attachment_info.content_type;
                    const md5 = attachment_info.digest.slice(4);
                    res.set('ETag', JSON.stringify(md5));
                    res.setHeader('Content-Type', type);
                    res.status(200).send(new Buffer(attachment));
                }
            );
        });
    }
}

export default CoreController;

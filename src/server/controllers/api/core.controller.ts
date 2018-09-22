import * as express from 'express';
import { assign } from 'lodash';
import { IRequest } from '../../middleware/auth';
import * as path from 'path';

import * as mkdirp from 'mkdirp';
import { exec } from 'child_process';
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
        exec(
            "/sbin/ip route|awk '/default/ { print $3 }'",
            (error, stdout, stderr) => {
                if (error || stderr !== '') {
                    return res.status(400).json(error || stderr);
                }
                const host_ip_address = stdout.replace(/\n/g, '');

                exec(
                    '/usr/bin/sshpass -p ' +
                        process.env.HOST_PW +
                        " ssh -o 'StrictHostKeyChecking no' " +
                        process.env.HOST_USER +
                        '@' +
                        host_ip_address +
                        " 'sudo shutdown -h 0'",
                    (shutdown_error, shutdown_stdout, shutdown_stderr) => {
                        if (shutdown_error) {
                            return res.status(400).json(shutdown_error);
                        }

                        res.status(200).json(shutdown_stderr);
                    }
                );
            }
        );
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

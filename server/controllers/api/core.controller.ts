import * as express from 'express';
import { assign } from 'lodash';
import { IRequest } from '../../middleware/auth';
import * as path from 'path';
import * as request from 'superagent';

import * as bcrypt from 'bcrypt-nodejs';
import db from '../../db';
import Host from '../../core/host';
import * as raven from 'raven';
import * as envfile from 'envfile';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

export class CoreController {
    public install_admin(req: IRequest, res: express.Response) {
        db.findById('system', (find_system_error, system) => {
            if (find_system_error) {
                return res.status(400).json(find_system_error);
            }

            if (system.installed) {
                return res
                    .status(409)
                    .json({ message: 'system_already_installed' });
            }

            db.findById('admin', (find_admin_error, admin) => {
                if (find_admin_error) {
                    return res.status(400).json(find_admin_error);
                }

                admin.name = req.body.username;
                admin.language = req.body.language;
                admin.password = bcrypt.hashSync(req.body.password); // use sync for now.

                db.updateOne(
                    'admin',
                    admin,
                    (update_admin_error, updated_admin) => {
                        if (update_admin_error) {
                            return res.status(400).json(find_admin_error);
                        }

                        db.updateOne(
                            'system',
                            { installed: true },
                            (update_system_error, _system) => {
                                res.status(200).end();
                            }
                        );
                    }
                );
            });
        });
    }

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
        // if (!req.files) {
        //     return res.status(400).send('No files were uploaded.');
        // }

        // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        // const uploaded_file = req.files.file;

        // db.saveAttachment(
        //     req.query.path,
        //     uploaded_file.name,
        //     uploaded_file.data,
        //     uploaded_file.mimetype,
        //     (error, success) => {
        //         res.status(200).end();
        //     }
        // );
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

        // fs.readFile(
        //     path.join(
        //         path.resolve(
        //             'build/files/' + req.params.id + '/' + req.params.attachment
        //         )
        //     ),
        //     (error, buffer) => {
        //         if (error) {
        //             return res.status(404).end();
        //         }
        //         res.status(200).send(buffer);
        //     }
        // );
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

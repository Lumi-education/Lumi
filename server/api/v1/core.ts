import * as express from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jwt-simple';
import * as debug from 'debug';
import { assign } from 'lodash';
import * as raven from 'raven';
import { IRequest } from '../../middleware/auth';

import DB from '../../db_v1';
import { IDB } from '../../db_v1/interface';

import ErrorResponse from '../../core/error';

const log_info = debug('lumi:api:v1:system');

class CoreController {
    public get(req: IRequest, res: express.Response) {
        try {
            const db: IDB = new DB(req.params.db);

            db.findById('core')
                .then(core => {
                    res.status(200).json(core);
                })
                .catch(error => {
                    res.status(404).json(
                        new ErrorResponse(
                            'core',
                            'InvalidDB',
                            'system.invalid_db'
                        )
                    );
                });
        } catch (error) {
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse('core', 'ServerError', 'core.server_error')
            );
        }
    }

    public post(req: IRequest, res: express.Response) {
        try {
            if (!/^[a-z0-9_\-]+$/.test(req.params.db)) {
                return res
                    .status(500)
                    .json(
                        new ErrorResponse(
                            'core',
                            'init_db',
                            'Only lowercase characters (a-z) and digits (0-9) are allowed'
                        )
                    );
            }

            const db: IDB = new DB(req.params.db);

            db.findById('core')
                .then(core => {
                    res.status(409).json(
                        new ErrorResponse(
                            'core',
                            'SystemAlreadyInstalled',
                            'core.system_installed'
                        )
                    );
                })
                .catch(error => {
                    const admin_user = req.body.user || {};

                    if (!admin_user.name || !admin_user.password) {
                        return res
                            .status(400)
                            .json(
                                new ErrorResponse(
                                    'core',
                                    'InvalidUser',
                                    'core.invalid_user'
                                )
                            );
                    }
                    // bcrypt.hash(admin_user.password, null, null, (err, pw) => {
                    //     if (err) {
                    //         return res
                    //             .status(500)
                    //             .json(
                    //                 new ErrorResponse(
                    //                     'core',
                    //                     'ServerError',
                    //                     'core.server_error'
                    //                 )
                    //             );
                    //     }
                    assign(admin_user, { password: admin_user.password });

                    db.init(admin_user)
                        .then(init => {
                            res.status(200).end();
                        })
                        .catch(init_error => {
                            res.status(500).json(
                                new ErrorResponse(
                                    'core',
                                    'init_db',
                                    init_error.message
                                )
                            );
                        });
                });
            // });
        } catch (error) {
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse('core', 'ServerError', 'core.server_error')
            );
        }
    }

    public delete(req: IRequest, res: express.Response) {
        try {
            const db: IDB = new DB(req.params.db);

            db.drop()
                .then(response => {
                    res.status(200).end();
                })
                .catch(error => {
                    res.status(error.statusCode).json(
                        new ErrorResponse(
                            'core',
                            'ServerError',
                            'core.db_not_deleted'
                        )
                    );
                });
        } catch (error) {
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse('core', 'ServerError', 'core.server_error')
            );
        }
    }
}

export default new CoreController();

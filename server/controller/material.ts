import * as express from 'express';
import * as debug from 'debug';
import { assign } from 'lodash';
import * as raven from 'raven';
import { IRequest } from '../middleware/auth';

import DB from '../db';
import { IDB } from '../db/interface';
import { IMaterial } from 'lib/material/types';

import ErrorResponse from '../core/error';

const log_info = debug('lumi:info:api:v1:material');
const log_error = debug('lumi:error:api:v1:material');

class MaterialController {
    public create_material(req: IRequest, res: express.Response) {
        try {
            const db: IDB = new DB(req.params.db);
            const material = req.body;

            log_info('create_material', req.params.db, 'start');

            db.insert<IMaterial>(material)
                .then(created_material => {
                    log_info('create_material', req.params.db, 'success');
                    res.status(200).json([
                        assign(material, {
                            _id: created_material.id,
                            _rev: created_material.rev
                        })
                    ]);
                })
                .catch(error => {
                    log_error('create_material', req.params.db, error);
                    raven.captureException(error);
                    res.status(500).json(
                        new ErrorResponse(
                            'material',
                            'ServerError',
                            'material.server_error'
                        )
                    );
                });
        } catch (error) {
            log_error('create_material', req.params.db, error);
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse('core', 'ServerError', 'core.server_error')
            );
        }
    }

    public find(req: IRequest, res: express.Response) {
        const db: IDB = new DB(req.params.db);
        const query = assign(req.body, {
            selector: assign({}, req.body.selector, { type: 'material' })
        });

        db.find(query).then(response => res.status(200).json(response));
    }

    public read_material(req: IRequest, res: express.Response) {
        try {
            const db: IDB = new DB(req.params.db);
            const material_ids = req.query.material_ids;

            log_info('read_material', req.params.db, 'start');

            db.view<IMaterial>('material', 'index', {
                keys: JSON.parse(material_ids)
            })
                .then(response => {
                    res.status(200).json(response.rows.map(row => row.doc));
                })
                .catch(error => {
                    log_error('read_material', req.params.db, error);
                    raven.captureException(error);
                    res.status(500).json(
                        new ErrorResponse(
                            'material',
                            'ServerError',
                            'material.server_error'
                        )
                    );
                });
        } catch (error) {
            log_error('read_material', req.params.db, error);
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse('core', 'ServerError', 'core.server_error')
            );
        }
    }

    public update_material(req: IRequest, res: express.Response) {
        try {
            const db: IDB = new DB(req.params.db);
            const material = req.body;

            log_info('update_material', req.params.db, material._id, 'start');

            db.updateOne<IMaterial>(material)
                .then(updated_material => {
                    log_info(
                        'update_material',
                        req.params.db,
                        material._id,
                        'success'
                    );

                    res.status(200).json([
                        assign(material, {
                            _rev: updated_material.rev
                        })
                    ]);
                })
                .catch(error => {
                    log_error(
                        'update_material',
                        req.params.db,
                        material._id,
                        error
                    );
                    raven.captureException(error);
                    res.status(500).json(
                        new ErrorResponse(
                            'core',
                            'ServerError',
                            'core.server_error'
                        )
                    );
                });
        } catch (error) {
            log_error('update_material', req.params.db, error);
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse('core', 'ServerError', 'core.server_error')
            );
        }
    }

    public delete_material(req: IRequest, res: express.Response) {
        try {
            const db: IDB = new DB(req.params.db);
            const material_id = req.params.material_id;

            log_info(
                'delete_material',
                req.params.db,
                req.params.material_id,
                'start'
            );

            db.findById<IMaterial>(material_id)
                .then(material => {
                    material._deleted = true;
                    db.updateOne(material).then(deleted_material => {
                        log_info(
                            'delete_material',
                            req.params.db,
                            req.params.material_id,
                            'success'
                        );
                        res.status(200).end();
                    });
                })
                .catch(error => {
                    log_error(
                        'delete_material',
                        req.params.db,
                        req.params.material_id,
                        error
                    );
                    raven.captureException(error);
                    res.status(400).end();
                });
        } catch (error) {
            log_error(
                'delete_material',
                req.params.db,
                req.params.material_id,
                error
            );
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse('core', 'ServerError', 'core.server_error')
            );
        }
    }

    public get_attachment(req: IRequest, res: express.Response) {
        try {
            const db: IDB = new DB(req.params.db);
            log_info('get_attachment', req.params.db, req.params.id);

            db.findById<IMaterial>(req.params.id)
                .then(material => {
                    const attachment_info = material._attachments
                        ? material._attachments[req.params.attachment]
                        : undefined;

                    if (!attachment_info) {
                        log_error(
                            'get_attachment',
                            'MissingAttachment',
                            req.params.db,
                            req.params.id,
                            req.params.attachment
                        );
                        return res
                            .status(404)
                            .json(
                                new ErrorResponse(
                                    'material',
                                    'MissingAttachment',
                                    'material.missing_attachment'
                                )
                            );
                    }

                    db.getAttachment(req.params.id, req.params.attachment)
                        .then(attachment => {
                            const type = attachment_info.content_type;
                            const md5 = attachment_info.digest.slice(4);
                            res.set('ETag', JSON.stringify(md5));
                            res.setHeader('Content-Type', type);
                            res.status(200).send(attachment);
                        })
                        .catch(error => {
                            log_error(
                                'get_attachment',
                                'MissingAttachment',
                                req.params.db,
                                req.params.id
                            );
                            raven.captureException(error);
                            res.status(404).json(
                                new ErrorResponse(
                                    'material',
                                    'MissingAttachment',
                                    'material.missing_attachment'
                                )
                            );
                        });
                })
                .catch(error => {
                    log_error(
                        'get_attachment',
                        req.params.db,
                        req.params.id,
                        error
                    );
                    res.status(404).json(
                        new ErrorResponse(
                            'material',
                            'MissingDoc',
                            'material.missing_doc'
                        )
                    );
                });
        } catch (error) {
            log_error('get_attachment', req.params.db, req.params.id);
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse(
                    'material',
                    'ServerError',
                    'core.server_error'
                )
            );
        }
    }
}

export default new MaterialController();

import * as debug from 'debug';
import * as path from 'path';
import * as raven from 'raven';
import * as express from 'express';
import DB from '../../db';
import { IDB } from '../../db/interface';
import { IH5PMaterial } from 'lib/material/types';
import { IH5PInterface, IContent, IH5P } from 'h5p-nodejs-library';
import upload_complete from './upload_complete';
import handle_response from './handle_response';
import generate_id from './generate_id';

const log_error = debug('lumi:error:h5p:interface');
const log_info = debug('lumi:info:h5p:interface');

const h5pinterface: IH5PInterface = {
    generate_id,
    upload_complete,
    handle_response,
    load_content_json: (
        req: express.Request,
        cb: (error, content: IContent) => void
    ) => {
        const db_name = req.baseUrl.split('/')[3];
        log_info('load_content_json', 'start', db_name, req.query.content_id);

        const db: IDB = new DB(db_name);

        db.findById<IH5PMaterial>(req.query.content_id)
            .then(material => {
                log_info(
                    'load_content_json',
                    'success',
                    db_name,
                    req.query.content_id
                );
                cb(undefined, material.content);
            })
            .catch(error => {
                log_error(
                    'load_content_json',
                    db_name,
                    req.query.content_id,
                    error
                );
                raven.captureException(error);
                cb(error, undefined);
            });
    },
    load_h5p_json: (
        req: express.Request,
        cb: (error, h5p_json: IH5P) => void
    ) => {
        const db_name = req.baseUrl.split('/')[3];
        const db: IDB = new DB(db_name);

        log_info('save_h5p_json', db_name, req.query.content_id, 'start');

        db.findById<IH5PMaterial>(req.query.content_id)
            .then(material => {
                cb(undefined, material.h5p);
            })
            .catch(error => {
                log_error(
                    'load_h5p_json',
                    db_name,
                    req.query.content_id,
                    error
                );
                raven.captureException(error);
                cb(error, undefined);
            });
    },
    load_library: (name: string, cb: (error, library) => void) => {
        try {
            log_info('load_library', name, 'start');

            cb(
                undefined,
                require(path.resolve(
                    path.join(
                        'build/client/static/h5p/libraries',
                        name,
                        'library.json'
                    )
                ))
            );
        } catch (error) {
            log_error('load_library', name, error);
            raven.captureException(error);
            cb(error, undefined);
        }
    },
    load_content: (
        req: express.Request,
        file_name: string,
        cb: (error: Error, buffer: Buffer) => void
    ) => {
        const db_name = req.baseUrl.split('/')[3];
        const db: IDB = new DB(db_name);

        log_info('load_content', db_name, req.query.content_id, 'start');

        const attachment_name = path.basename(file_name);

        db.getAttachment(req.params.content_id, attachment_name)
            .then(attachment => {
                cb(undefined, attachment);
            })
            .catch(error => {
                log_error(
                    'load_content',
                    db_name,
                    req.params.content_id,
                    attachment_name,
                    error
                );
                raven.captureException(error);
                cb(error, undefined);
            });
    },
    save_h5p_json: (
        req: express.Request,
        h5p_json: JSON,
        done: (error) => void
    ) => {
        const db_name = req.baseUrl.split('/')[3];
        const db: IDB = new DB(db_name);

        log_info('save_h5p_json', db_name, req.query.content_id, 'start');

        db.findById<IH5PMaterial>(req.query.content_id)
            .then(material => {
                material.h5p = h5p_json as any;
                material.name = material.name || (h5p_json as any).title;

                db.updateOne<IH5PMaterial>(material).then(updated_material => {
                    done(undefined);
                });
            })
            .catch(error => {
                log_error(
                    'save_h5p_json',
                    db_name,
                    req.query.content_id,
                    error
                );
                raven.captureException(error);
                done(error);
            });
    },
    save_content_json: (
        req: express.Request,
        content_json: JSON,
        done: (error) => void
    ) => {
        const db_name = req.baseUrl.split('/')[3];
        const db: IDB = new DB(db_name);

        log_info('save_content_json', db_name, req.query.content_id, 'start');

        db.findById<IH5PMaterial>(req.query.content_id)
            .then(material => {
                material.content = content_json as any;

                db.updateOne<IH5PMaterial>(material).then(updated_material => {
                    done(undefined);
                });
            })
            .catch(error => {
                log_error(
                    'save_content_json',
                    db_name,
                    req.query.content_id,
                    error
                );
                raven.captureException(error);
                done(error);
            });
    },
    save_content: (req: express.Request, file_name: string, content: Buffer) =>
        new Promise((resolve, reject) => {
            const db_name = req.baseUrl.split('/')[3];
            log_info(
                'save_content',
                db_name,
                req.query.content_id,
                file_name,
                'start'
            );
            const db: IDB = new DB(db_name);

            db.saveAttachment(
                req.query.content_id,
                file_name,
                content,
                'image/jpeg'
            )
                .then(res => {
                    log_info(
                        'save_content',
                        db_name,
                        req.query.content_id,
                        file_name,
                        'success'
                    );
                    resolve(res.ok);
                })
                .catch(error => {
                    log_error(
                        'save_content',
                        db_name,
                        req.query.content_id,
                        file_name,
                        error
                    );
                    raven.captureException(error);
                    reject(false);
                });
        }),

    max_concurrent: 1,
    max_queued: Infinity,

    library_dir: path.resolve('build/client/static/h5p/libraries'),
    core_dir: path.resolve('build/client/static/h5p'),
    tmp_dir: process.env.DATA_DIR + '/tmp',
    integration: {
        postUserStatistics: true,
        ajaxPath: '',
        ajax: {
            setFinished: '/test',
            contentUserData: '/test'
        },
        saveFreq: 30,
        user: {
            name: 'test',
            mail: 'test@Lumi.education'
        }
    }
};

export default h5pinterface;

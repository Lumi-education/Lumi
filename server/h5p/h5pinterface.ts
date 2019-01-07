import * as debug from 'debug';
import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as raven from 'raven';
import db from '../db';

import { IH5PInterface, IContent, IH5P } from 'h5p-nodejs-library';
import upload_complete from './upload_complete';

const log_error = debug('lumi:error:h5p:interface');
const log_info = debug('lumi:info:h5p:interface');

const h5pinterface: IH5PInterface = {
    upload_complete,
    load_content_json: (
        content_id: string,
        cb: (error, content: IContent) => void
    ) => {
        db.findById(content_id, (error, card) => {
            if (error) {
                raven.captureException(error);
            }
            if (card) {
                cb(error, card.content);
            } else {
                cb('card not found', undefined);
            }
        });
    },
    load_h5p_json: (
        content_id: string,
        cb: (error, h5p_json: IH5P) => void
    ) => {
        db.findById(content_id, (error, card) => {
            if (error) {
                raven.captureException(error);
            }
            cb(error, card.h5p);
        });
    },
    load_library: (name: string, cb: (error, library) => void) => {
        try {
            cb(
                undefined,
                require(path.resolve(
                    path.join('build/h5p/libraries', name, 'library.json')
                ))
            );
        } catch (error) {
            raven.captureException(error);
        }
    },
    load_content: (
        content_id: string,
        file_name: string,
        cb: (error: Error, buffer: Buffer) => void
    ) => {
        fs.readFile(
            path.resolve('build/h5p/content', content_id, 'content', file_name),
            (error, buffer) => {
                if (error) {
                    raven.captureException(error);
                }
                cb(error, buffer);
            }
        );
    },
    save_h5p_json: (
        content_id: string,
        h5p_json: JSON,
        done: (error) => void
    ) => {
        db.updateOne(content_id, { h5p: h5p_json }, (error, updated_card) => {
            if (error) {
                raven.captureException(error);
            }
            done(undefined);
        });
    },
    save_content_json: (
        content_id: string,
        content_json: JSON,
        done: (error) => void
    ) => {
        db.updateOne(
            content_id,
            { content: content_json },
            (error, updated_card) => {
                if (error) {
                    raven.captureException(error);
                }
                done(error);
            }
        );
    },
    save_content: (content_id: string, file_name: string, content: Buffer) => {
        try {
            mkdirp(
                path.resolve(
                    path.join(
                        'build/h5p/content',
                        content_id,
                        'content',
                        'images'
                    )
                ),
                () => {
                    fs.writeFile(
                        path.join(
                            'build/h5p/content',
                            content_id,
                            'content',
                            'images',
                            file_name
                        ),
                        content,
                        () => {
                            console.log('file written');
                        }
                    );
                }
            );
        } catch (error) {
            raven.captureException(error);
        }
    },

    library_dir: path.resolve('build/h5p/libraries'),
    core_dir: path.resolve('build/client/static/h5p'),
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

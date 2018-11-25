import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

import db from '../db';

import { IH5PInterface, IContent, IH5P } from 'h5p-nodejs-library';

const h5pinterface: IH5PInterface = {
    load_content_json: (
        content_id: string,
        cb: (error, content: IContent) => void
    ) => {
        db.findById(content_id, (error, card) => {
            cb(error, card.content);
        });
    },
    load_h5p_json: (
        content_id: string,
        cb: (error, h5p_json: IH5P) => void
    ) => {
        db.findById(content_id, (error, card) => {
            cb(error, card.h5p);
        });
    },
    load_library: (name: string, cb: (error, library) => void) => {
        cb(
            undefined,
            require(path.resolve(
                path.join('build/h5p/libraries', name, 'library.json')
            ))
        );
    },
    load_content: (
        content_id: string,
        file_name: string,
        cb: (error: Error, buffer: Buffer) => void
    ) => {
        fs.readFile(
            path.resolve('build/h5p/content', content_id, 'content', file_name),
            (error, buffer) => {
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
                done(error);
            }
        );
    },
    save_content: (content_id: string, file_name: string, content: Buffer) => {
        mkdirp(
            path.resolve(
                path.join('build/h5p/content', content_id, 'content', 'images')
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

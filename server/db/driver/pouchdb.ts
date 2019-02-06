import * as request from 'superagent';
import * as url from 'url';
import { assign, noop } from 'lodash';
import * as debug from 'debug';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
// import * as PouchDBWebSQL from 'pouchdb-adapter-node-websql';
import * as express from 'express';
import * as express_pouchdb from 'express-pouchdb';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import * as raven from 'raven';

import views from '../setup/views';
import init from '../setup/init';

import { IDoc } from 'lib/core/types';

const log_info = debug('lumi:info:db:driver:v1:pouchdb');
const log_error = debug('lumi:error:db:driver:v1:pouchdb');

PouchDB.plugin(PouchDBFind);
// PouchDB.plugin(PouchDBWebSQL);
PouchDB.defaults({ prefix: process.env.DB });

import {
    IDB,
    IViewResponse,
    IQuery,
    IFindResponse,
    IMutateResponse
} from '../interface';

export default class DB implements IDB {
    public api: express.Router;

    private db: PouchDB;
    private name: string;

    constructor(db_name: string) {
        try {
            this.db = new PouchDB.defaults({ prefix: process.env.DB })(
                db_name,
                {
                    // skip_setup: true
                    // adapter: 'websql'
                }
            );
            this.name = db_name;

            this.api = express_pouchdb(
                PouchDB.defaults({ prefix: process.env.DB }),
                {
                    logPath: process.env.DB + 'pouchdb.log',
                    configPath: process.env.DB + 'pouchdb.config'
                }
            );

            this.init = this.init.bind(this);
            log_info('constructor', 'finished', this.name);
        } catch (error) {
            log_error('constructor', error);
            raven.captureException(error);
        }
    }

    public view<T>(
        _design: string,
        index: string,
        options
    ): Promise<IViewResponse<T>> {
        log_info('view', _design, index, options);
        const _options = assign({ include_docs: true, sorted: false }, options);
        return this.db.query(_design + '/' + index, _options);
    }

    public findById<T>(id: string): Promise<T> {
        log_info('findById', id);
        return this.db.get(id);
    }

    public find<T>(query: IQuery): Promise<IFindResponse<T>> {
        log_info('find', query);
        return this.db.find(query);
    }

    public insert<T>(doc: T, options?): Promise<IMutateResponse> {
        log_info('insert', doc, options);
        return this.db.post(doc);
    }

    public insertMany<T>(docs: T[], options?): Promise<IMutateResponse[]> {
        log_info('insertMany', docs, options);
        return this.db.bulkDocs(docs, options);
    }

    public updateOne<T>(doc: T): Promise<IMutateResponse> {
        log_info('updateOne', doc);
        return this.db.put(doc);
    }

    public saveAttachment(
        id: string,
        attachment_name: string,
        attachment: Buffer,
        type: string
    ): Promise<IMutateResponse> {
        log_info('saveAttachment', id, attachment_name);
        return this.findById<IDoc>(id).then(doc => {
            return this.db.putAttachment(
                id,
                attachment_name,
                doc._rev,
                attachment,
                type
            );
        });
    }

    public getAttachment(
        doc_id: string,
        attachment_name: string
    ): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            log_info('getAttachment', doc_id, attachment_name);
            const cached_file_path = path.join(
                process.env.DATA_DIR,
                'cache',
                doc_id,
                attachment_name
            );

            log_info(
                'getAttachment',
                'checking cached file at ',
                cached_file_path
            );
            fs.readFile(cached_file_path, (err, data) => {
                if (err) {
                    log_info('getAttachment', 'no cached file found');
                    return this.db
                        .getAttachment(doc_id, attachment_name)
                        .then(buffer => {
                            mkdirp(
                                path.join(
                                    process.env.DATA_DIR,
                                    'cache',
                                    doc_id
                                ),
                                mkdirp_error => {
                                    if (mkdirp_error) {
                                        log_error(
                                            'getAttachment',
                                            'mkdirp',
                                            mkdirp_error
                                        );
                                        return resolve(buffer);
                                    }
                                    fs.writeFile(
                                        cached_file_path,
                                        buffer,
                                        _err => {
                                            if (_err) {
                                                return log_error(
                                                    'getAttachment',
                                                    _err
                                                );
                                            }
                                            log_info(
                                                'getAttachment',
                                                'file cached'
                                            );
                                        }
                                    );
                                    log_info(
                                        'getAttachment',
                                        'sending cached file'
                                    );
                                    resolve(buffer);
                                }
                            );
                        });
                }
                log_info('getAttachment', 'cached file found - sending file');
                resolve(data);
            });
        });
    }

    public init(admin_user): Promise<any> {
        log_info('init', this.name);
        return new Promise<any>((resolve, reject) => {
            try {
                this.db = new PouchDB.defaults({ prefix: process.env.DB })(
                    this.name
                );
                log_info('init', 'db created');
                this.insertMany(views)
                    .then(views_response => {
                        this.insertMany(init(admin_user)).then(
                            init_response => {
                                resolve(this.db);
                            }
                        );
                    })
                    .catch(error => reject(error));
            } catch (error) {
                reject(error);
            }
        });
    }

    public drop(): Promise<{ ok: boolean }> {
        log_info('drop', this.name);
        return this.db.destroy();
    }
}

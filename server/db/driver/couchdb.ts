import * as url from 'url';
import { assign } from 'lodash';
import * as debug from 'debug';
import * as nano from 'nano';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as raven from 'raven';

const log_info = debug('lumi:info:db:driver:v1:couchdb');
const log_error = debug('lumi:error:db:driver:v1:couchdb');

import { IDoc } from 'lib/core/types';

import views from '../setup/views';
import init from '../setup/init';

import {
    IDB,
    IViewResponse,
    IQuery,
    IFindResponse,
    IMutateResponse,
    IAdminUserInit
} from '../interface';

export default class DB implements IDB {
    private db: any;
    private host: string;
    private nano: any;
    private name: string;

    constructor(db_name: string) {
        try {
            const _db = url.parse(process.env.DB);
            this.host =
                _db.protocol +
                    '//' +
                    (_db.auth ? _db.auth + '@' : '') +
                    _db.host || 'http://localhost:5984';
            this.db = nano(this.host).use(db_name);
            this.nano = nano(this.host);
            this.name = db_name;
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
        const _options = assign(options, { include_docs: true, sorted: false });
        return this.db.view(_design, index, _options);
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
        return this.db.insert(doc, options);
    }

    public insertMany<T>(docs: T[], options?): Promise<IMutateResponse[]> {
        log_info('insertMany', docs, options);
        return this.db.bulk({ docs });
    }

    public updateOne<T>(doc: T): Promise<IMutateResponse> {
        log_info('updateOne', doc);
        return this.insert<T>(doc);
    }

    public saveAttachment(
        id: string,
        attachment_name: string,
        attachment: Buffer,
        type: string
    ): Promise<IMutateResponse> {
        log_info('saveAttachment', id, attachment_name);
        return this.findById<IDoc>(id).then(doc => {
            return this.db.attachment.insert(
                doc._id,
                attachment_name,
                attachment,
                type,
                { rev: doc._rev }
            );
        });
    }

    public getAttachment(
        doc_id: string,
        attachment_name: string
    ): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            log_info('getAttachment', doc_id, attachment_name);
            const cached_file_path = path.resolve(
                path.join('build/cache', doc_id, attachment_name)
            );
            log_info(
                'getAttachment',
                'checking cached file at ',
                cached_file_path
            );
            fs.readFile(cached_file_path, (err, data) => {
                if (err) {
                    log_info('getAttachment', 'no cached file found');
                    return this.db.attachment.get(
                        doc_id,
                        attachment_name,
                        (error, result) => {
                            if (error) {
                                log_error('getAttachment', error);
                                return reject(error);
                            }
                            log_info('getAttachment', 'caching file');
                            mkdirp(
                                path.join('build/cache', doc_id),
                                mkdirp_error => {
                                    if (mkdirp_error) {
                                        log_error(
                                            'getAttachment',
                                            mkdirp_error
                                        );
                                        return resolve(result);
                                    }
                                    fs.writeFile(
                                        cached_file_path,
                                        result,
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
                                    resolve(result);
                                }
                            );
                        }
                    );
                }
                log_info('getAttachment', 'cached file found - sending file');
                resolve(data);
            });
        });
    }

    public init(admin_user: IAdminUserInit): Promise<any> {
        log_info('init', this.name);
        return this.nano.db.create(this.name).then(body => {
            log_info('init', 'db created');
            return this.insertMany(views).then(views_response => {
                return this.insertMany(init(admin_user));
            });
        });
    }

    public drop(): Promise<{ ok: boolean }> {
        log_info('drop', this.name);
        return this.nano.db.destroy(this.name);
    }
}

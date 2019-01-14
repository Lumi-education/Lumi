import * as request from 'superagent';
import * as url from 'url';
import { assign, noop } from 'lodash';
import * as debug from 'debug';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

import * as raven from 'raven';

import views from '../setup/views';
import init from '../setup/init';

import { IDoc } from 'lib/core/types';

const log_info = debug('lumi:info:db:driver:v1:pouchdb');
const log_error = debug('lumi:error:db:driver:v1:pouchdb');

PouchDB.plugin(PouchDBFind);
PouchDB.defaults({ prefix: process.env.DB });

import {
    IDB,
    IViewResponse,
    IQuery,
    IFindResponse,
    IMutateResponse
} from '../interface';

export default class DB implements IDB {
    private db: PouchDB;
    private name: string;

    constructor(db_name: string) {
        try {
            this.db = new PouchDB.defaults({ prefix: process.env.DB })(
                db_name,
                {
                    skip_setup: true
                }
            );
            this.name = db_name;

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
        log_info('getAttachment', doc_id, attachment_name);
        return this.db.getAttachment(doc_id, attachment_name);
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

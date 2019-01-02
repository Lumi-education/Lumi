import * as request from 'superagent';
import * as url from 'url';
import { assign, noop } from 'lodash';
import * as debug from 'debug';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

import * as raven from 'raven';

const log = debug('lumi:db:driver:v1:pouchdb');

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

    constructor(db_name: string) {
        this.db = new PouchDB.defaults({ prefix: process.env.DB })(db_name);
    }

    public view<T>(
        _design: string,
        index: string,
        options
    ): Promise<IViewResponse<T>> {
        const _options = assign({ include_docs: true, sorted: false }, options);
        return this.db.query(_design + '/' + index, _options);
    }

    public findById<T>(id: string): Promise<T> {
        return this.db.get(id);
    }

    public find<T>(query: IQuery): Promise<IFindResponse<T>> {
        return this.db.find(query);
    }

    public insert<T>(doc: T): Promise<IMutateResponse> {
        return this.db.post(doc);
    }
}

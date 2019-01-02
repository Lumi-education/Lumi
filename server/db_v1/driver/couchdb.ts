import * as request from 'superagent';
import * as url from 'url';
import { assign, noop } from 'lodash';
import * as debug from 'debug';
import * as nano from 'nano';

import * as raven from 'raven';

const log = debug('lumi:db:driver:v1:couchdb');

import {
    IDB,
    IViewResponse,
    IQuery,
    IFindResponse,
    IMutateResponse
} from '../interface';

export default class DB implements IDB {
    private nano: any;

    constructor(db_name: string) {
        const _db = url.parse(process.env.DB);
        const _db_host =
            _db.protocol + '//' + (_db.auth ? _db.auth + '@' : '') + _db.host;
        this.nano = nano(_db_host || 'http://localhost:5984').use(db_name);
    }

    public view<T>(
        _design: string,
        index: string,
        options
    ): Promise<IViewResponse<T>> {
        const _options = assign(options, { include_docs: true, sorted: false });
        return this.nano.view(_design, index, _options);
    }

    public findById<T>(id: string): Promise<T> {
        return this.nano.get(id);
    }

    public find<T>(query: IQuery): Promise<IFindResponse<T>> {
        return this.nano.find(query);
    }

    public insert<T>(doc: T, options?): Promise<IMutateResponse> {
        return this.nano.insert(doc, options);
    }
}

import * as request from 'superagent';
import * as url from 'url';
import { assign, noop } from 'lodash';
import * as debug from 'debug';
import * as nano from 'nano';

import * as raven from 'raven';

const log_info = debug('lumi:info:db:driver:v1:couchdb');

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
        const _db = url.parse(process.env.DB);
        this.host =
            _db.protocol + '//' + (_db.auth ? _db.auth + '@' : '') + _db.host ||
            'http://localhost:5984';
        this.db = nano(this.host).use(db_name);
        this.nano = nano(this.host);
        this.name = db_name;
    }

    public view<T>(
        _design: string,
        index: string,
        options
    ): Promise<IViewResponse<T>> {
        const _options = assign(options, { include_docs: true, sorted: false });
        return this.db.view(_design, index, _options);
    }

    public findById<T>(id: string): Promise<T> {
        return this.db.get(id);
    }

    public find<T>(query: IQuery): Promise<IFindResponse<T>> {
        return this.db.find(query);
    }

    public insert<T>(doc: T, options?): Promise<IMutateResponse> {
        return this.db.insert(doc, options);
    }

    public insertMany<T>(docs: T[], options?): Promise<IMutateResponse[]> {
        return this.db.bulk({ docs });
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
        return this.nano.db.destroy(this.name);
    }
}

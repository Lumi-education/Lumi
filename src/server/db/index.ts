import * as request from 'superagent';
import { assign, noop } from 'lodash';
import * as express from 'express';
import * as debug from 'debug';
import * as nano from 'nano';

import webhook from '../core/webhook';

import * as raven from 'raven';

// const db = process.env.DB_HOST + '/' + process.env.DB + '/';
const _nano = nano(process.env.DB_HOST);
// const nano_db = _nano.use(process.env.DB);

const log = debug('lumi:db');

export class DB {
    private res: express.Response;
    private db: string;
    private nano: any;

    constructor(res: express.Response, db: string) {
        this.res = res;

        this.db = process.env.DB_HOST + '/' + db + '/';
        this.nano = _nano.use(db);

        this.handle_error = this.handle_error.bind(this);
        this.findById = this.findById.bind(this);
        this.save = this.save.bind(this);
        this.insert = this.insert.bind(this);
        this.find = this.find.bind(this);
        this.findOne = this.findOne.bind(this);
        this.update_one = this.update_one.bind(this);
        this.checkView = this.checkView.bind(this);
        this.view = this.view.bind(this);
        this.delete = this.delete.bind(this);
        this.dbList = this.dbList.bind(this);
    }

    public findById(id: string, cb: (doc) => void, type?) {
        request
            .get(this.db + id)
            .then(res => {
                log('findById', id);
                cb(type ? new type(res.body) : res.body);
            })
            .catch(err => {
                this.handle_error(err);
            });
    }

    public _findById(id: string, cb: (err, doc) => void) {
        request
            .get(this.db + id)
            .then(res => {
                log('_findById', id);
                cb(null, res.body);
            })
            .catch(err => {
                cb(err, null);
            });
    }

    public save(doc, cb?: (res) => void) {
        request
            .put(this.db + doc._id)
            .send(assign(doc, { updated_at: new Date() }))
            .then(res => {
                log('SAVED', doc._id);
                if (cb) {
                    cb(res);
                } else {
                    this.res.status(200).json(
                        assign({}, doc, {
                            _id: res.body.id,
                            _rev: res.body.rev
                        })
                    );
                }
            })
            .catch(this.handle_error);
    }

    public insert(doc, cb?: (res) => void) {
        request
            .post(this.db)
            .send(assign(doc, { created_at: new Date() }))
            .then(res => {
                log('CREATED: ', res.body.id);
                if (cb) {
                    cb(res);
                } else {
                    this.res.status(200).json(
                        assign({}, doc, {
                            _id: res.body.id,
                            _rev: res.body.rev
                        })
                    );
                }
            })
            .catch(this.handle_error);
    }

    public find(query, options, cb: (doc) => void, type?) {
        if (options.limit) {
            options.limit = parseInt(options.limit, 10);
        }
        request
            .post(this.db + '_find')
            .send(assign({ selector: query }, options))
            .then(res => {
                cb(type ? res.body.docs.map(d => new type(d)) : res.body.docs);
            })
            .catch(this.handle_error);
    }

    public findOne(query, options, cb: (doc) => void, type?) {
        this.find(
            query,
            assign(options, { limit: 1 }),
            docs => {
                cb(docs[0]);
            },
            type
        );
    }

    public update_one(id: string, update, cb?: (doc) => void) {
        request
            .get(this.db + id)
            .then(({ body }) => {
                const newDoc = assign({}, body, update, {
                    updated_at: new Date()
                });
                request
                    .put(this.db + body._id)
                    .send(newDoc)
                    .then(res => {
                        cb
                            ? cb(assign({}, newDoc, { _rev: res.body.rev }))
                            : noop();
                    })
                    .catch(this.handle_error);
            })
            .catch(this.handle_error);
    }

    public checkView(name: string, cb: (doc) => void) {
        log('checking for view', name);
        request
            .get(this.db + name)
            .then(res => {
                log('view ' + name + ' exists');
                cb(res.body);
            })
            .catch(err => {
                log('view ' + name + ' does not exist');
                cb(undefined);
            });
    }

    public view(_design: string, index: string, options, cb: (docs) => void) {
        const _options = assign(options, { include_docs: true });

        this.nano.view(_design, index, _options, (err, body) => {
            if (err) {
                this.handle_error(err);
            } else {
                if (body) {
                    cb(
                        body.rows
                            .map(row => row.doc)
                            .filter(doc => doc !== null)
                    );
                } else {
                    cb([]);
                }
            }
        });
    }

    public delete(id: string, cb?: () => void) {
        this.findById(id, doc => {
            request
                .delete(this.db + id + '?rev=' + doc._rev)
                .then(() => {
                    log('DELETED: ', id);
                    if (!cb) {
                        this.res.status(200).end();
                    }
                })
                .catch(this.handle_error);
        });
    }

    public dbList(cb: (dbs: string[]) => void) {
        _nano.db.list((err, body) => {
            if (err) {
                this.handle_error(err);
            } else {
                cb(body);
            }
        });
    }

    public checkDb(cb: (db) => void) {
        request
            .get(this.db)
            .then(res => cb(res))
            .catch(this.handle_error);
    }

    private handle_error(err) {
        raven.captureException(err);

        if (this.res) {
            try {
                this.res
                    .status(
                        err.status > 100 && err.status < 520 ? err.status : 500
                    )
                    .json(
                        process.env.NODE_ENV === 'development'
                            ? err
                            : { message: err.message || err }
                    );
            } catch (err) {
                raven.captureException(err);
            }
        }
    }
}

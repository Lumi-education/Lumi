import * as request from 'superagent';
import { assign } from 'lodash';
import * as express from 'express';
import * as debug from 'debug';
import * as nano from 'nano';

const db = process.env.DB_HOST + '/' + process.env.DB + '/';
const _nano = nano(process.env.DB_HOST);
const nano_db = _nano.use(process.env.DB);

const log = debug('lumi:db');

export class DB {
    private res: express.Response;

    constructor(res: express.Response) {
        this.res = res;

        this.handle_error = this.handle_error.bind(this);
    }

    public findById(id: string, cb: (doc) => void, type?) {
        request
            .get(db + id)
            .then(res => {
                log('findById', id);
                cb(type ? new type(res.body) : res.body);
            })
            .catch(err => {
                this.handle_error(err);
            });
    }

    public save(doc, cb?: (res) => void) {
        request
            .put(db + doc._id)
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
            .post(db)
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
            .post(db + '_find')
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

    public update_one(id: string, update, cb: (doc) => void) {
        request
            .get(db + id)
            .then(({ body }) => {
                const newDoc = assign({}, body, update, {
                    updated_at: new Date()
                });
                request
                    .put(db + body._id)
                    .send(newDoc)
                    .then(res => cb(assign({}, newDoc, { _rev: res.body.rev })))
                    .catch(this.handle_error);
            })
            .catch(this.handle_error);
    }

    public checkView(name: string, cb: (doc) => void) {
        log('checking for view', name);
        request
            .get(db + name)
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

        nano_db.view(_design, index, _options, (err, body) => {
            if (err) {
                this.handle_error(err);
            }
            cb(body.rows.map(row => row.doc));
        });
    }

    public delete(id: string, cb?: () => void) {
        this.findById(id, doc => {
            request
                .delete(db + id + '?rev=' + doc._rev)
                .then(() => {
                    log('DELETED: ', id);
                    if (!cb) {
                        this.res.status(200).end();
                    }
                })
                .catch(this.handle_error);
        });
    }

    private handle_error(err) {
        if (this.res) {
            this.res.status(500).end('db error: ' + JSON.stringify(err));
        }
    }
}

import * as request from 'superagent';
import { assign } from 'lodash';
import * as express from 'express';

const db = process.env.DB_HOST + '/' + process.env.DB + '/';

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
                cb(type ? new type(res.body) : res.body);
            })
            .catch(this.handle_error);
    }

    public save(doc, cb?: (res) => void) {
        request
            .put(db + doc._id)
            .send(assign(doc, { updated_at: new Date() }))
            .then(res => {
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
        request
            .post(db + '_find')
            .send(
                assign({ selector: query }, assign(options, { limit: 10000 }))
            )
            .then(res => {
                cb(type ? res.body.docs.map(d => new type(d)) : res.body.docs);
            })
            .catch(this.handle_error);
    }

    public findOne(query, options, cb: (doc) => void, type?) {
        this.find(
            query,
            options,
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

    public delete(id: string, cb?: () => void) {
        this.findById(id, doc => {
            request
                .delete(db + id + '?rev=' + doc._rev)
                .then(() => {
                    if (!cb) {
                        this.res.status(200).end();
                    }
                })
                .catch(this.handle_error);
        });
    }

    private handle_error(err) {
        this.res.status(500).end('db error: ' + JSON.stringify(err));
    }
}

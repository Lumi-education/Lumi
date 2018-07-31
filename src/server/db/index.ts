import * as request from 'superagent';
import {assign, noop} from 'lodash';
import * as debug from 'debug';
import * as nano from 'nano';

import * as raven from 'raven';

const _nano = nano(process.env.DB_HOST);

const log = debug('lumi:db');

export class DB {
    private db: string;
    private nano: any;

    constructor() {
        this.db = process.env.DB_HOST + '/' + process.env.DB + '/';
        this.nano = _nano.use(process.env.DB);

        this.findById = this.findById.bind(this);
        this.save = this.save.bind(this);
        this.insert = this.insert.bind(this);
        this.find = this.find.bind(this);
        this.findOne = this.findOne.bind(this);
        this.updateOne = this.updateOne.bind(this);
        this.checkView = this.checkView.bind(this);
        this.view = this.view.bind(this);
        this.delete = this.delete.bind(this);
    }

    public findById(id: string, cb: (err, doc) => void) {
        request
            .get(this.db + id)
            .then(res => {
                log('findById', id);
                cb(undefined, res.body);
            })
            .catch(err => {
                cb(err, undefined);
                raven.captureException(err);
            });
    }

    public _findById(id: string, cb: (err, doc) => void) {
        this.findById(id, cb);
    }

    public save(doc, cb?: (err, saved_doc) => void) {
        request
            .put(this.db + doc._id)
            .send(assign(doc, {updated_at: new Date()}))
            .then(res => {
                log('SAVED', doc._id);
                if (cb) {
                    cb(
                        undefined,
                        assign({}, doc, {
                            _id: res.body.id,
                            _rev: res.body.rev
                        })
                    );
                }
            })
            .catch(err => {
                if (cb) {
                    cb(err, undefined);
                }
                raven.captureException(err);
            });
    }

    public insert(doc, cb?: (err, doc) => void) {
        request
            .post(this.db)
            .send(assign(doc, {created_at: new Date()}))
            .then(res => {
                log('CREATED: ', res.body.id);

                if (cb) {
                    cb(
                        undefined,
                        assign({}, doc, {
                            _id: res.body.id,
                            _rev: res.body.rev
                        })
                    );
                }
            })
            .catch(err => {
                if (cb) {
                    cb(err, undefined);
                }
                raven.captureException(err);
            });
    }

    public insertMany(docs: any[], options, callback: (error, docs) => void) {
        request
            .post(this.db + '_bulk_docs')
            .send({docs})
            .then(res => {
                callback(undefined, res.body);
            })
            .catch(err => {
                callback(err, undefined);
                raven.captureException(err);
            });
    }

    public updateMany(docs: any[], options, cb: (err, docs) => void) {
        this.insertMany(docs, options, cb);
    }

    public find(query, options, cb: (error, doc) => void) {
        if (options.limit) {
            options.limit = parseInt(options.limit, 10);
        }
        request
            .post(this.db + '_find')
            .send(
                assign(
                    {
                        selector: query
                    },
                    options
                )
            )
            .then(res => {
                cb(undefined, res.body.docs);
            })
            .catch(err => {
                cb(err, undefined);
                raven.captureException(err);
            });
    }

    public findOne(query, options, cb: (error, doc) => void) {
        this.find(query, assign(options, {limit: 1}), (error, docs) => {
            cb(error, docs[0]);
        });
    }

    public updateOne(id: string, update, cb?: (error, doc) => void) {
        request
            .get(this.db + id)
            .then(({body}) => {
                const newDoc = assign({}, body, update, {
                    updated_at: new Date()
                });
                request
                    .put(this.db + body._id)
                    .send(newDoc)
                    .then(res => {
                        cb
                            ? cb(
                                  undefined,
                                  assign({}, newDoc, {_rev: res.body.rev})
                              )
                            : noop();
                    })
                    .catch(err => {
                        if (cb) {
                            cb(err, undefined);
                        }
                    });
            })
            .catch(err => {
                if (cb) {
                    cb(err, undefined);
                }
                raven.captureException(err);
            });
    }

    public update(selector, update, options, cb: (error, docs) => void) {
        this.find(selector, options, docs => {
            const updated_docs = docs.map(doc => assign(doc, update));

            request
                .post(this.db + '_bulk_docs')
                .send({docs: updated_docs})
                .then(res => {
                    cb(undefined, res.body);
                })
                .catch(err => {
                    cb(err, undefined);
                    raven.captureException(err);
                });
        });
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
                raven.captureException(err);
            });
    }

    public view(
        _design: string,
        index: string,
        options,
        cb: (error, docs) => void
    ) {
        const _options = assign(options, {include_docs: true});

        this.nano.view(_design, index, _options, (err, body) => {
            if (err) {
                cb(err, undefined);
                raven.captureException(err);
            } else {
                if (body) {
                    cb(
                        undefined,
                        body.rows
                            .map(row => row.doc)
                            .filter(doc => doc !== null)
                    );
                } else {
                    cb(undefined, []);
                }
            }
        });
    }

    public delete(id: string, cb?: (err) => void) {
        this.findById(id, doc => {
            request
                .delete(this.db + id + '?rev=' + doc._rev)
                .then(() => {
                    log('DELETED: ', id);
                    if (cb) {
                        cb(undefined);
                    }
                })
                .catch(err => {
                    cb(err);
                    raven.captureException(err);
                });
        });
    }

    // public checkDb(cb: (db) => void) {
    //     request
    //         .get(this.db)
    //         .then(res => cb(res))
    //         .catch(this.handle_error);
    // }
}

export default new DB();

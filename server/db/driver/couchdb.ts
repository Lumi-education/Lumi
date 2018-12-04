import * as request from 'superagent';
import * as url from 'url';
import { assign, noop } from 'lodash';
import * as debug from 'debug';
import * as nano from 'nano';
import * as ChangeStream from 'changes-stream';
import * as Event from 'events';

import * as raven from 'raven';

const log = debug('lumi:db:driver:couchdb');

export default class DB {
    public changes: Event;
    private changes_stream;
    private db: string;
    private nano: any;

    constructor() {
        const _db = url.parse(process.env.DB);
        const _db_host =
            _db.protocol + '//' + (_db.auth ? _db.auth + '@' : '') + _db.host;
        this.db = _db.href + '/';
        this.nano = nano(_db_host || 'http://localhost:5984').use(
            _db.pathname.replace(/\//g, '') || 'test'
        );

        this.findById = this.findById.bind(this);
        this.save = this.save.bind(this);
        this.insert = this.insert.bind(this);
        this.find = this.find.bind(this);
        this.findOne = this.findOne.bind(this);
        this.updateOne = this.updateOne.bind(this);
        this.delete = this.delete.bind(this);
        this.saveAttachment = this.saveAttachment.bind(this);
        this.getAttachment = this.getAttachment.bind(this);

        this.changes = new Event();
        this.changes.setMaxListeners(32);

        this.changes_stream = ChangeStream({
            db: process.env.DB_HOST + '/' + process.env.DB,
            include_docs: true,
            since: 'now'
        });

        this.changes_stream.on('error', err => {
            raven.captureException(err);
        });

        this.changes_stream._onError(raven.captureException);

        this.changes_stream.on('readable', () => {
            try {
                const change = this.changes_stream.read();

                this.changes.emit('change', change.doc);
            } catch (err) {
                raven.captureException(err);
            }
        });
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

    // public _findById(id: string, cb: (err, doc) => void) {
    //     this.findById(id, cb);
    // }

    public save(doc, cb?: (err, saved_doc) => void) {
        request
            .put(this.db + doc._id)
            .send(assign(doc, { updated_at: new Date() }))
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
            .send(assign(doc, { created_at: new Date() }))
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
            .send({ docs })
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
                raven.captureException(err);
                cb(err, undefined);
            });
    }

    public findOne(query, options, cb: (error, doc) => void) {
        this.find(query, assign(options, { limit: 1 }), (error, docs) => {
            cb(error, docs[0]);
        });
    }

    public updateOne(id: string, update, cb?: (error, doc) => void) {
        request
            .get(this.db + id)
            .then(({ body }) => {
                const newDoc = assign(
                    {},
                    body,
                    update,
                    {
                        updated_at: new Date()
                    },
                    { _rev: body._rev }
                );
                request
                    .put(this.db + body._id)
                    .send(newDoc)
                    .then(res => {
                        cb
                            ? cb(
                                  undefined,
                                  assign({}, newDoc, {
                                      _rev: res.body.rev,
                                      _attachments: res.body_attachments
                                  })
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
                .send({ docs: updated_docs })
                .then(res => {
                    cb(undefined, res.body);
                })
                .catch(err => {
                    cb(err, undefined);
                    raven.captureException(err);
                });
        });
    }

    public view(
        _design: string,
        index: string,
        options,
        cb: (error, docs) => void
    ) {
        const _options = assign(options, { include_docs: true, sorted: false });

        this.nano.view(_design, index, _options, (err, body) => {
            if (err) {
                raven.captureException(err);
                cb(err, undefined);
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
        this.findById(id, (error, doc) => {
            if (error) {
                throw new Error(error);
            }
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

    public saveAttachment(
        _id: string,
        attachment_id: string,
        attachment,
        type,
        cb: (error, success) => void
    ) {
        this.findById(_id, (error, doc) => {
            this.nano.attachment.insert(
                doc._id,
                attachment_id,
                attachment,
                type,
                { rev: doc._rev },
                (nano_error, result) => {
                    if (nano_error) {
                        return cb(nano_error, undefined);
                    }
                    assign(doc, {
                        _rev: result.rev
                    });

                    cb(undefined, doc);
                }
            );
        });
    }

    public getAttachment(
        _id: string,
        attachment_id: string,
        cb: (error, attachment) => void
    ) {
        this.nano.attachment.get(_id, attachment_id, (nano_error, result) => {
            cb(nano_error, result);
        });
    }
}

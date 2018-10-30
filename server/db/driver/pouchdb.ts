// import * as request from 'superagent';
import { assign, noop } from 'lodash';
import * as debug from 'debug';
// import * as nano from 'nano';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

import * as raven from 'raven';

// const _nano = nano(process.env.DB_HOST);
const db = new PouchDB('./pouchdb-test');

const log = debug('lumi:db');

export class DB {
    private db: string;
    private nano: any;

    constructor() {
        this.db = process.env.DB_HOST + '/' + process.env.DB + '/';
        // this.nano = _nano.use(process.env.DB);

        this.findById = this.findById.bind(this);
        this.save = this.save.bind(this);
        this.insert = this.insert.bind(this);
        this.find = this.find.bind(this);
        this.findOne = this.findOne.bind(this);
        this.updateOne = this.updateOne.bind(this);
        this.delete = this.delete.bind(this);
    }

    public findById(id: string, cb: (err, doc) => void) {
        log('findById', id);
        db.get(id, cb);

        // request
        //     .get(this.db + id)
        //     .then(res => {
        //         log('findById', id);
        //         cb(undefined, res.body);
        //     })
        //     .catch(err => {
        //         cb(err, undefined);
        //         raven.captureException(err);
        // });
    }

    // public _findById(id: string, cb: (err, doc) => void) {
    //     this.findById(id, cb);
    // }

    public save(doc, cb: (err, saved_doc) => void) {
        log('save is deprecated');
        throw new Error('Save is deprecated');
        // request
        //     .put(this.db + doc._id)
        //     .send(assign(doc, { updated_at: new Date() }))
        //     .then(res => {
        //         log('SAVED', doc._id);
        //         if (cb) {
        //             cb(
        //                 undefined,
        //                 assign({}, doc, {
        //                     _id: res.body.id,
        //                     _rev: res.body.rev
        //                 })
        //             );
        //         }
        //     })
        //     .catch(err => {
        //         if (cb) {
        //             cb(err, undefined);
        //         }
        //         raven.captureException(err);
        //     });
    }

    public insert(doc, cb: (err, doc) => void) {
        log('insert', doc);
        db.post(doc, (error, body) => {
            if (cb) {
                cb(
                    undefined,
                    assign({}, doc, {
                        _id: body.id,
                        _rev: body.rev
                    })
                );
            }
        });

        // request
        //     .post(this.db)
        //     .send(assign(doc, { created_at: new Date() }))
        //     .then(res => {
        //         log('CREATED: ', res.body.id);

        //         if (cb) {
        //             cb(
        //                 undefined,
        //                 assign({}, doc, {
        //                     _id: res.body.id,
        //                     _rev: res.body.rev
        //                 })
        //             );
        //         }
        //     })
        //     .catch(err => {
        //         if (cb) {
        //             cb(err, undefined);
        //         }
        //         raven.captureException(err);
        //     });
    }

    public insertMany(docs: any[], options, callback: (error, docs) => void) {
        log('insertMany', docs, options);
        db.bulkDocs(docs, options, callback);
        // request
        //     .post(this.db + '_bulk_docs')
        //     .send({ docs })
        //     .then(res => {
        //         callback(undefined, res.body);
        //     })
        //     .catch(err => {
        //         callback(err, undefined);
        //         raven.captureException(err);
        //     });
    }

    public updateMany(docs: any[], options, cb: (err, docs) => void) {
        log('updateMany', docs, options);
        this.insertMany(docs, options, cb);
    }

    public find(query, options, cb: (error, doc) => void) {
        log('find', query, options);
        if (options.limit) {
            options.limit = parseInt(options.limit, 10);
        }
        db.find({ selector: query }, (cb_err, res) => {
            cb(null, res.docs);
        });
        // request
        //     .post(this.db + '_find')
        //     .send(
        //         assign(
        //             {
        //                 selector: query
        //             },
        //             options
        //         )
        //     )
        //     .then(res => {
        //         cb(undefined, res.body.docs);
        //     })
        //     .catch(err => {
        //         raven.captureException(err);
        //         cb(err, undefined);
        //     });
    }

    public findOne(query, options, cb: (error, doc) => void) {
        log('findOne', query, options);
        this.find(query, assign(options, { limit: 1 }), (error, docs) => {
            cb(error, docs[0]);
        });
    }

    public updateOne(id: string, update, cb: (error, doc) => void) {
        log('updateOne', id, update);
        this.findById(id, (error, doc) => {
            assign(doc, update);
            db.put(doc, cb);
        });
        // request
        //     .get(this.db + id)
        //     .then(({ body }) => {
        //         const newDoc = assign({}, body, update, {
        //             updated_at: new Date()
        //         });
        //         request
        //             .put(this.db + body._id)
        //             .send(newDoc)
        //             .then(res => {
        //                 cb
        //                     ? cb(
        //                           undefined,
        //                           assign({}, newDoc, { _rev: res.body.rev })
        //                       )
        //                     : noop();
        //             })
        //             .catch(err => {
        //                 if (cb) {
        //                     cb(err, undefined);
        //                 }
        //             });
        //     })
        //     .catch(err => {
        //         if (cb) {
        //             cb(err, undefined);
        //         }
        //         raven.captureException(err);
        //     });
    }

    public update(selector, update, options, cb: (error, docs) => void) {
        log('update', selector, update, options);
        this.find(selector, options, docs => {
            const updated_docs = docs.map(doc => assign(doc, update));

            db.bulkDocs(updated_docs, options, update, cb);

            // request
            //     .post(this.db + '_bulk_docs')
            //     .send({ docs: updated_docs })
            //     .then(res => {
            //         cb(undefined, res.body);
            //     })
            //     .catch(err => {
            //         cb(err, undefined);
            //         raven.captureException(err);
            //     });
        });
    }

    public view(
        _design: string,
        index: string,
        options,
        cb: (error, docs) => void
    ) {
        log('view', _design, index, options);
        const _options = assign(options, { include_docs: true });

        db.query(_design + '/' + index, options, (err, body) => {
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

        // this.nano.view(_design, index, _options, (err, body) => {
        //     if (err) {
        //         raven.captureException(err);
        //         cb(err, undefined);
        //     } else {
        //         if (body) {
        //             cb(
        //                 undefined,
        //                 body.rows
        //                     .map(row => row.doc)
        //                     .filter(doc => doc !== null)
        //             );
        //         } else {
        //             cb(undefined, []);
        //         }
        //     }
        // });
    }

    public delete(id: string, cb: (err) => void) {
        log('delete');
        // this.findById(id, (error, doc) => {
        //     if (error) {
        //         throw new Error(error);
        //     }
        //     request
        //         .delete(this.db + id + '?rev=' + doc._rev)
        //         .then(() => {
        //             log('DELETED: ', id);
        //             if (cb) {
        //                 cb(undefined);
        //             }
        //         })
        //         .catch(err => {
        //             cb(err);
        //             raven.captureException(err);
        //         });
        // });
    }
}

export default new DB();

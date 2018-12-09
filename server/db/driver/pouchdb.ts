import { assign } from 'lodash';
import * as debug from 'debug';
import * as mkdirp from 'mkdirp';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
import * as express_pouchdb from 'express-pouchdb';
import * as express from 'express';

import * as Event from 'events';

PouchDB.plugin(PouchDBFind);
PouchDB.defaults({ prefix: process.env.DB });

import * as raven from 'raven';

const log = debug('lumi:db:driver:pouchdb');

export default class DB {
    public changes: Event;
    public api: express.Router;
    private changes_stream;
    private db: PouchDB;
    constructor() {
        log('creating ' + process.env.DB);
        mkdirp.sync(process.env.DB);
        this.api = express_pouchdb(
            PouchDB.defaults({ prefix: process.env.DB })
        );
        this.db = new PouchDB.defaults({ prefix: process.env.DB })('lumi');
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

        this.changes_stream = this.db.changes({
            since: 'now',
            live: true,
            include_docs: true
        });

        this.changes_stream
            .on('change', change => {
                this.changes.emit('change', change.doc);
            })
            .on('error', err => {
                raven.captureException(err);
            });
    }

    public findById(id: string, cb: (err, doc) => void) {
        log('findById', id);
        this.db.get(id, cb);
    }

    public save(doc, cb: (err, saved_doc) => void) {
        log('save is deprecated');
        throw new Error('Save is deprecated');
    }

    public insert(doc, cb: (err, doc) => void) {
        log('insert', doc);
        this.db.post(doc, (error, body) => {
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
    }

    public insertMany(docs: any[], options, callback: (error, docs) => void) {
        log('insertMany', docs, options);
        this.db.bulkDocs(docs, options, callback);
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
        this.db.find({ selector: query }, (cb_err, res) => {
            cb(null, res.docs);
        });
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
            assign(doc, update, { _rev: doc._rev });
            this.db.put(doc, (db_err, result) => {
                if (db_err) {
                    return cb(db_err, undefined);
                }
                assign(doc, {
                    _id: result.id,
                    _rev: result.rev
                });
                cb(undefined, doc);
            });
        });
    }

    public update(selector, update, options, cb: (error, docs) => void) {
        log('update', selector, update, options);
        this.find(selector, options, docs => {
            const updated_docs = docs.map(doc => assign(doc, update));

            this.db.bulkDocs(updated_docs, options, update, cb);
        });
    }

    public view(
        _design: string,
        index: string,
        options,
        cb: (error, docs) => void
    ) {
        log('view', _design, index, options);
        const _options = assign(options, { include_docs: true, sorted: false });

        this.db.query(_design + '/' + index, options, (err, body) => {
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

    public delete(id: string, cb: (err) => void) {
        log('delete');
    }

    public saveAttachment(
        _id: string,
        attachment_id: string,
        attachment,
        type,
        cb: (error, success) => void
    ) {
        this.findById(_id, (error, doc) => {
            if (error) {
                return cb(error, undefined);
            }
            this.db.putAttachment(
                doc._id,
                attachment_id,
                doc._rev,
                new Buffer(attachment),
                type,
                cb
            );
        });
    }

    public getAttachment(
        _id: string,
        attachment_id: string,
        cb: (error, attachment) => void
    ) {
        this.db.getAttachment(_id, attachment_id, (err, blobOrBuffer) => {
            if (err) {
                return console.log(err);
            }
            console.log('test');
            cb(err, blobOrBuffer);
        });
    }
}

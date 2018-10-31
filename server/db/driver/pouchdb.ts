import { assign } from 'lodash';
import * as debug from 'debug';
import * as mkdirp from 'mkdirp';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
import * as Event from 'events';

PouchDB.plugin(PouchDBFind);

import * as raven from 'raven';

const log = debug('lumi:db:driver:pouchdb');

export default class DB {
    public changes: Event;
    private changes_stream;
    private db: PouchDB;

    constructor() {
        log('creating ' + process.env.LUMI_DIR);
        mkdirp.sync(process.env.LUMI_DIR);
        this.db = new PouchDB(process.env.LUMI_DIR || '.pouchdb');
        this.findById = this.findById.bind(this);
        this.save = this.save.bind(this);
        this.insert = this.insert.bind(this);
        this.find = this.find.bind(this);
        this.findOne = this.findOne.bind(this);
        this.updateOne = this.updateOne.bind(this);
        this.delete = this.delete.bind(this);

        this.changes = new Event();

        this.changes_stream = this.db.changes({
            since: 'now',
            live: true,
            include_docs: true
        });

        this.changes_stream
            .on('change', change => {
                this.changes.emit('change', {
                    type: 'DB_CHANGE',
                    payload: [change.doc]
                });
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
            assign(doc, update);
            this.db.put(doc, cb);
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
        const _options = assign(options, { include_docs: true });

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
}

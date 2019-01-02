import * as debug from 'debug';
import * as url from 'url';

const log = debug('lumi:db');

import CouchDB from './driver/couchdb';
import PouchDB from './driver/pouchdb';

let db;

const DB = url.parse(process.env.DB);

if (DB.protocol === null) {
    log('using pouchdb-driver');
    db = PouchDB;
} else {
    log('using couchdb-driver');
    db = CouchDB;
}

export default db;

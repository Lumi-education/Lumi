import * as debug from 'debug';

const log = debug('lumi:db');

import CouchDB from './driver/couchdb';
import PouchDB from './driver/pouchdb';

let db;
switch (process.env.DB_DRIVER) {
    case 'pouchdb':
        log('using pouchdb-driver');
        db = new PouchDB();
        break;
    case 'couchdb':
    default:
        log('using couchdb-driver');
        db = new CouchDB();
        break;
}

export default db;

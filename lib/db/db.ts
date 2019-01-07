import * as debug from 'debug';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import * as Core from 'lib/core';

declare var window;
let db;

try {
    PouchDB.plugin(PouchDBFind);

    const log_info = debug('lumi:info:db');
    const log_error = debug('lumi:error:db');

    const db_name = window.location.pathname.split('/')[1] || 'lumi';
    log_info('using db ', db_name);
    db = new PouchDB(db_name);

    window.db = db;
} catch (error) {
    Core.raven.captureExceoption(error);
}

export default db;

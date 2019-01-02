import * as debug from 'debug';
import PouchDB from 'pouchdb';

import * as PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

const log_info = debug('lumi:info:db');
const log_error = debug('lumi:error:db');

const db_name = window.location.pathname.split('/')[1] || 'lumi';

log_info('using db ', db_name);
const db = new PouchDB(db_name);

declare var window;
window.db = db;

export default db;

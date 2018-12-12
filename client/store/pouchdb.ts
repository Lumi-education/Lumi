import * as debug from 'debug';
import PouchDB from 'pouchdb';
import store from './';

import * as PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

export const db_name = 'test';

const log_info = debug('lumi:info:db');
const log_error = debug('lumi:error:db');

const db = new PouchDB(db_name);

const remote_db = new PouchDB(`${window.location.origin}/api/v1/${db_name}`, {
    fetch: (url, opts) => {
        opts.headers.set('x-auth', window.localStorage.jwt_token);
        return PouchDB.fetch(url, opts);
    }
});
PouchDB.sync(db, remote_db, {
    live: true,
    retry: true
})
    .on('change', changes => {
        log_info('changes', changes);
        if (changes.direction === 'pull') {
            store.dispatch({ type: 'DB_CHANGE', payload: changes.change.docs });
        }
    })
    .on('paused', error => {
        log_info('paused', error);
        // replication paused (e.g. replication up to date, user went offline)
    })
    .on('active', () => {
        log_info('active');
        // replicate resumed (e.g. new changes replicating, user went back online)
    })
    .on('denied', error => {
        log_error('denied', error);
        // a document failed to replicate (e.g. due to permissions)
    })
    .on('complete', info => {
        log_info('complete', info);
        //
    })
    .on('error', error => {
        log_error('error', error);
        // handle error
    });

declare var window;
window.db = db;

export default db;

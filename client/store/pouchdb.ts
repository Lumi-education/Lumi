import PouchDB from 'pouchdb';
import store from './';

import * as PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

export const db_name = 'lumi';

const db = new PouchDB(db_name);

PouchDB.sync(db, `${window.location.origin}/api/v1/${db_name}`, {
    live: true,
    retry: true
})
    .on('change', changes => {
        if (changes.direction === 'pull') {
            store.dispatch({ type: 'DB_CHANGE', payload: changes.change.docs });
        }
    })
    .on('paused', err => {
        // replication paused (e.g. replication up to date, user went offline)
    })
    .on('active', () => {
        // replicate resumed (e.g. new changes replicating, user went back online)
    })
    .on('denied', err => {
        // a document failed to replicate (e.g. due to permissions)
    })
    .on('complete', info => {
        //
    })
    .on('error', err => {
        // handle error
    });

export default db;

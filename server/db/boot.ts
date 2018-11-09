import * as url from 'url';
import * as superagent from 'superagent';
import * as _debug from 'debug';
import * as raven from 'raven';

import setup_db from './setup';

const debug = _debug('lumi:db:boot');

export default function(done: () => void) {
    const DB = url.parse(process.env.DB);

    if (DB.protocol === null) {
        debug('Booting with pouchdb - no need to wait for couchdb to be up.');

        setup_db(() => {
            done();
        });
    } else {
        const DB_HOST = DB.protocol + '//' + DB.host;
        debug('start polling for db');

        const couchdb_polling = setInterval(() => {
            debug('polling ' + DB.href);
            superagent
                .get(DB_HOST)
                .then(res => {
                    debug('CouchDB on ' + DB_HOST + ' is up.');

                    debug('canceling couchdb polling');
                    clearInterval(couchdb_polling);
                    setup_db(() => {
                        done();
                    });
                })
                .catch(err => {
                    debug('CouchDB on ' + DB_HOST + ' is not up.', err);
                    raven.captureException(err);
                });
        }, process.env.POLLING_INTERVAL || 1000);
    }
}

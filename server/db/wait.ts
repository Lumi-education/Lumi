import * as superagent from 'superagent';
import * as _debug from 'debug';
import * as raven from 'raven';

const debug = _debug('lumi:db:wait');

export default function wait_for_db(boot: () => void) {
    if (process.env.DB_DRIVER === 'pouchdb') {
        debug('booting with pouchdb - no need to wait for couchdb to be up.');
        return boot();
    }
    debug('start polling for db');
    const couchdb_polling = setInterval(() => {
        debug('polling ' + process.env.DB_HOST);
        superagent
            .get(process.env.DB_HOST)
            .then(res => {
                debug('CouchDB on ' + process.env.DB_HOST + ' is up.');

                debug('canceling couchdb polling');
                clearInterval(couchdb_polling);

                boot();
            })
            .catch(err => {
                debug('CouchDB on ' + process.env.DB_HOST + ' is not up.', err);
                raven.captureException(err);
            });
    }, process.env.POLLING_INTERVAL || 1000);
}

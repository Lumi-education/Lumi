import * as superagent from 'superagent';
import * as _debug from 'debug';

const debug = _debug('wait_for_couchdb');

export default function wait_for_couchdb(boot: () => void) {
    debug('start polling for dbs');
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
            });
    }, process.env.POLLING_INTERVAL || 1000);
}

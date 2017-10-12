import * as superagent from 'superagent';
import * as _debug from 'debug';

const debug = _debug('wait_for_couchdb');

export default function wait_for_couchdb(boot: () => void) {
	debug('start polling for dbs');
	let couchdb_polling = setInterval(
	() => {
		debug('polling ' + (process.env.DB_HOST || 'http://localhost:5984'));
		superagent
			.get(process.env.DB_HOST || 'http://localhost:5984')
			.then(res => {
				debug('CouchDB on ' + (process.env.DB_HOST || 'http://localhost:5984') + ' is up.');

				debug('canceling couchdb polling');
				clearInterval(couchdb_polling);

				boot();
			})
			.catch(err => {
				debug('CouchDB on ' + (process.env.DB_HOST || 'http://localhost:5984')+ ' is not up.', err);
			});
	}, 
	process.env.POLLING_INTERVAL || 1000);
}
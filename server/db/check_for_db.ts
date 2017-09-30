import * as _debug from 'debug';
import * as superagent from 'superagent';

const debug = _debug('db:exist');

export default function (done: () => void) {
	debug('starting boot-sequence');

	debug('check for db: '+process.env.DB);
	superagent
	.get(process.env.DB_HOST+'/'+process.env.DB)
	.then(res => {
		debug('OK db '+process.env.DB+' exists.');
		done();
	})
	.catch(err => {
		debug('db '+process.env.DB+' does not exist.');

		debug('creating db '+process.env.DB);

		superagent
		.put(process.env.DB_HOST+'/'+process.env.DB)
		.then(res => {
			debug('db '+process.env.DB+' created.');
			done();
		})
		.catch(err => {
			debug('ERROR: ', err);
		})
	});
}

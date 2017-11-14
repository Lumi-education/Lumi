import * as _debug from 'debug';
import * as superagent from 'superagent';

const debug = _debug('db:check');

export default function (done: () => void) {
	debug('check for db: ' + process.env.DB);
	superagent
	.get(process.env.DB_HOST + '/' + process.env.DB)
	.then(res => {
		debug(process.env.DB + ': OK');
		done();
	})
	.catch(err => {
		debug(process.env.DB + ': not OK');

		debug('creating db ' + process.env.DB);

		superagent
		.put(process.env.DB_HOST + '/' + process.env.DB)
		.then(res => {
			debug(process.env.DB + ': created');
			done();
		})
		.catch(error => {
			debug('ERROR: ', error);
		});
	});
}

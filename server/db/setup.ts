import * as _debug from 'debug';
import { assign }  from 'lodash';
import * as superagent from 'superagent';
import * as nano 	   from 'nano';
import * as _replicator from './_replicator';

const debug = _debug('db:setup');

export default function () {

	debug('start setup db');

	update('_replicator', 'init', _replicator.init);
}

function update(db: string, id: string, update: Object) {
	const _nano = nano(process.env.DB_HOST || 'http://localhost:5984');
	_nano.db.create(db, (err, body) => {
		debug(body);
		const _db = _nano.db.use(db);
		debug('start updating ' + db);
		_db.get(id, (err, body) => {
			const updated_doc = assign({}, body, update);
			_db.insert(updated_doc, (err, body) => {
				debug('doc ' + id + ' inupdated.');
			});
		});
	});
}
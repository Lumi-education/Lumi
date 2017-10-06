import * as _debug from 'debug';

import server from '../core/server';
import boot_api from '../api/boot';
import * as nano from 'nano';
import * as cluster from 'cluster';
import * as os from 'os';

import wait_for_couchdb from '../utils/wait_for_couchdb';
import boot_db 			from '../db/boot';
declare var process: any;

const debug = _debug('core');
const express_debug = _debug('boot:express');


export default function () {

	if (process.env.NODE_ENV !== 'production') {
		wait_for_couchdb( boot_db );
		boot();
	} else {
		const numCPUs = os.cpus().length;
		if (cluster.isMaster) {

			wait_for_couchdb( boot_db );

			for (let i = 0; i < numCPUs; i++) {
				const worker = cluster.fork();
			}

			cluster.on('exit', (deadWorker, code, signal) => {
				const worker = cluster.fork();
			});
		} else {
			boot();
		}
	}
}

function boot() {
	debug('starting boot-sequence');

	const _nano = nano( process.env.DB_HOST || 'http://localhost:5984');

	const lumidb = _nano.db.use( process.env.DB || 'lumidb');

	const httpServer = server.listen(process.env.PORT || 80, function () {
		express_debug('express-server successfully booted on port ' + process.env.PORT || 80);
	});

	boot_api(server, lumidb);


	debug('finished boot-sequence');
}

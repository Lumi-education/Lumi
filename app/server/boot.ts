import * as _debug from 'debug';

import app from './core/app';
import * as socketio from 'socket.io';
import * as cluster from 'cluster';
import * as os from 'os';

import wait_for_couchdb from './utils/wait_for_couchdb';
import check_db from './db/check';
import boot_socket from './core/socket';
import webhook from './core/webhook';

declare var process;

const debug = _debug('core');
const express_debug = _debug('boot:express');

// if (process.env.NODE_ENV !== 'production') {
wait_for_couchdb(() => {
    check_db(() => {
        boot();
    });
});

// boot();
// } else {
//     const numCPUs = os.cpus().length;
//     if (cluster.isMaster) {
//         wait_for_couchdb(() => {
//             check_db(() => {
//                 boot_websocket();
//             });
//         });

//         for (let i = 0; i < numCPUs; i++) {
//             const worker = cluster.fork();
//         }

//         cluster.on('exit', (deadWorker, code, signal) => {
//             const worker = cluster.fork();
//         });
//     } else {
//         boot();
//     }
// }

function boot() {
    debug('starting boot-sequence');

    const server = app.listen(process.env.PORT || 80, () => {
        debug(
            'express-server successfully booted on port ' + process.env.PORT ||
                80
        );
        webhook({
            username: 'System',
            text: 'Lumi successfully booted on port ' + process.env.PORT || 80
        });
    });

    const io = socketio(server);

    boot_socket(io);

    debug('finished boot-sequence');
}

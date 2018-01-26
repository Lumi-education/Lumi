import * as _debug from 'debug';

import app from './core/app';
import * as socketio from 'socket.io';

import wait_for_couchdb from './utils/wait_for_couchdb';
import check_db from './db/check';
import boot_socket from './core/socket';
import webhook from './core/webhook';
declare var process;
import * as raven from 'raven';

const debug = _debug('core');
const express_debug = _debug('boot:express');

wait_for_couchdb(() => {
    check_db(() => {
        boot();
    });
});

if (process.env.NODE_ENV === 'production') {
    raven
        .config(process.env.SENTRY, {
            release: process.env.VERSION,
            environment: process.env.NODE_ENV,
            tags: {
                branch: process.env.BRANCH,
                component: 'server'
            }
        })
        .install();
}

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

    server.on('error', raven.captureException);

    boot_socket(server);

    debug('finished boot-sequence');
}

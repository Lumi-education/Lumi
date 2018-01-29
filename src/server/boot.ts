import * as _debug from 'debug';
import * as raven from 'raven';

raven
    .config(process.env.SENTRY, {
        release: process.env.VERSION,
        environment: process.env.NODE_ENV,
        tags: {
            branch: process.env.BRANCH,
            component: 'server'
        },
        autoBreadcrumbs: true
    })
    .install();

import app from './core/app';
import * as socketio from 'socket.io';

import wait_for_couchdb from './utils/wait_for_couchdb';
import check_db from './db/check';
import boot_socket from './core/socket';
import webhook from './core/webhook';
import { boot as boot_cron } from './core/cron';
import modules from './modules/boot';

declare var process;

const debug = _debug('core');
const express_debug = _debug('boot:express');

wait_for_couchdb(() => {
    check_db(() => {
        boot();
    });
});

function boot() {
    debug('starting boot-sequence');

    const server = app.listen(process.env.PORT || 80, () => {
        debug(
            'express-server successfully booted on port ' + process.env.PORT ||
                80
        );

        boot_cron();
        modules();

        webhook({
            username: 'System',
            text: 'Lumi successfully booted on port ' + process.env.PORT || 80
        });
    });

    server.on('error', raven.captureException);

    boot_socket(server);

    debug('finished boot-sequence');
}

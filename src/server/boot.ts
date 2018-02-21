import * as _debug from 'debug';
import * as raven from 'raven';
import * as cluster from 'cluster';
import * as os from 'os';

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

import wait_for_db from './db/wait';
import setup_db from './db/setup';

import { boot as boot_cron } from './core/cron';
import boot_modules from './modules/boot';

declare var process;

const debug = _debug('core');
const express_debug = _debug('boot:express');

if (process.env.NODE_ENV !== 'production') {
    wait_for_db(() => {
        setup_db(() => {
            boot();
            boot_modules();
        });
    });
} else {
    const numCPUs = os.cpus().length;
    if (cluster.isMaster) {
        wait_for_db(() => {
            setup_db(() => {
                for (let i = 0; i < numCPUs; i++) {
                    const worker = cluster.fork();
                }
            });
        });
        cluster.on('exit', (deadWorker, code, signal) => {
            const worker = cluster.fork();
        });
    } else {
        boot();
        boot_modules();
    }
}

function boot() {
    debug('starting boot-sequence');

    const server = app.listen(process.env.PORT || 80, () => {
        debug(
            'express-server successfully booted on port ' + process.env.PORT ||
                80
        );
        raven.captureMessage('server booted', { level: 'info' });
    });

    server.on('error', raven.captureException);

    debug('finished boot-sequence');
}

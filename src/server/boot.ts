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

import * as cluster from 'cluster';
import * as os from 'os';

import wait_for_db from './db/wait';
import setup_db from './db/setup';

import boot_core from './core/boot';

declare var process;

if (process.env.NODE_ENV !== 'production') {
    wait_for_db(() => {
        setup_db(() => {
            boot_core();
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
        boot_core();
    }
}

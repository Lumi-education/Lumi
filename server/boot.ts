// setup env
process.env.DB = process.env.DB || './db/lumi';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.DEBUG = process.env.DEBUG || '*';
process.env.PORT = process.env.PORT || 3000;
process.env.KEY = process.env.KEY || 'abcdefg';

import * as raven from 'raven';
import * as debug from 'debug';

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

// import * as cluster from 'cluster';
// import * as os from 'os';

import boot_db from './db/boot';
import boot_core from './core/boot';

declare var process;

const log = debug('lumi:boot');

log('boot-file loaded');

// if (process.env.NODE_ENV !== 'production') {
//     log('booting in single-mode');
export function boot(done: () => void) {
    log('entering boot-sequence');

    boot_db(() => {
        boot_core(() => {
            done();
        });
    });
}

if (process.env.TARGET !== 'electron') {
    boot(() => {
        log('ending boot-sequence');
    });
}
// } else {
//     log('booting in cluster-mode');
//     const numCPUs = os.cpus().length;
//     if (cluster.isMaster) {
//         wait_for_db(() => {
//             setup_db(() => {
//                 for (let i = 0; i < numCPUs; i++) {
//                     const worker = cluster.fork();
//                 }
//             });
//         });
//         cluster.on('exit', (deadWorker, code, signal) => {
//             const worker = cluster.fork();
//         });
//     } else {
//         boot_core();
//     }
// }

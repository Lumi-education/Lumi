// setup env
process.env.DB = process.env.DB || './db/';
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

import * as cluster from 'cluster';
import * as os from 'os';
import * as http from 'http';

import boot_db from './db/boot';
import boot_core from './core/boot';
import boot_socket from './core/socket';

declare var process;

const log = debug('lumi:boot');

log('boot-file loaded');

export function boot(done: () => void) {
    log('entering boot-sequence');

    if (
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test'
    ) {
        log('booting in single-mode');
        boot_db(() => {
            boot_core((server: http.Server) => {
                // boot_socket(server);
                done();
            });
        });
    } else {
        log('booting in cluster-mode');
        const numCPUs = os.cpus().length;
        if (cluster.isMaster) {
            boot_db(() => {
                boot_core((server: http.Server) => {
                    // boot_socket(server);
                    for (let i = 0; i < numCPUs; i++) {
                        const worker = cluster.fork();
                    }
                    done();
                });
            });
            cluster.on('exit', (deadWorker, code, signal) => {
                const worker = cluster.fork();
            });
        } else {
            boot_core(server => {
                log('server booted');
            });
        }
    }
}

if (process.env.TARGET !== 'electron' && process.env.NODE_ENV !== 'test') {
    boot(() => {
        log('ending boot-sequence');
    });
}

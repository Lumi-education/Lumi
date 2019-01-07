// setup env
process.env.DB = process.env.DB || './db/';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.DEBUG = process.env.DEBUG || '*';
process.env.PORT = process.env.PORT || 3000;
process.env.KEY = process.env.KEY || 'abcdefg';
process.env.VERSION =
    process.env.VERSION || require('../../package.json').version;
import * as raven from 'raven';
import * as debug from 'debug';

raven
    .config(process.env.SENTRY, {
        release: process.env.VERSION,
        environment: process.env.NODE_ENV,
        tags: {
            component: 'server',
            lumi_id: process.env.LUMI_ID
        },
        autoBreadcrumbs: true
    })
    .install();

import * as cluster from 'cluster';
import * as os from 'os';
import * as http from 'http';

import boot_core from './core/boot';

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
        boot_core((server: http.Server) => {
            raven.captureMessage('Server booted', { level: 'info' });
            done();
        });
    } else {
        log('booting in cluster-mode');
        const numCPUs = os.cpus().length;
        if (cluster.isMaster) {
            for (let i = 0; i < numCPUs; i++) {
                const worker = cluster.fork();
            }
            cluster.on('exit', (deadWorker, code, signal) => {
                const worker = cluster.fork();
            });
            raven.captureMessage('Server booted', { level: 'info' });
            done();
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

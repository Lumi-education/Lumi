// setup env
process.env.DB = process.env.DB || './db/';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.DEBUG = process.env.DEBUG || '*';
process.env.PORT = process.env.PORT || 3000;
process.env.KEY = process.env.KEY || 'abcdefg';
process.env.VERSION =
    process.env.VERSION || require('../../package.json').version;
process.env.TARGET = process.env.TARGET || 'default';

import raven from './core/raven';

import * as debug from 'debug';

import * as cluster from 'cluster';
import * as os from 'os';
import * as http from 'http';

import boot_core from './core/boot';
import boot_addons from './addons/boot';

declare var process;

const log = debug('lumi:boot');

log('boot-file loaded');

export function boot(done: () => void) {
    log('entering boot-sequence');

    if (
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test' ||
        process.env.TARGET === 'electron'
    ) {
        log('booting in single-mode');
        boot_core((server: http.Server) => {
            raven.captureMessage('Server booted', { level: 'info' });
            boot_addons();
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
                raven.captureException(new Error('worker died'));
                const worker = cluster.fork();
            });
            raven.captureMessage('Server booted', { level: 'info' });
            boot_addons();
            done();
        } else {
            boot_core((server: http.Server) => {
                log('server booted');
            });
        }
    }
}

if (process.env.NODE_ENV !== 'test' && process.env.TARGET !== 'electron') {
    boot(() => {
        log('ending boot-sequence');
    });
}

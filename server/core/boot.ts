import * as debug from 'debug';
import * as raven from 'raven';
import * as express from 'express';

import app from './app';
import socket from './socket';
import * as http from 'http';

const log = debug('lumi:core:boot');

export default function boot(done: (server: http.Server) => void) {
    log('start boot-sequence');

    const server = app().listen(process.env.PORT || 80, () => {
        log(
            'express-server successfully booted on port ' + process.env.PORT ||
                80
        );
        done(server);
        raven.captureMessage('server booted', { level: 'info' });
    });

    server.on('error', raven.captureException);

    log('end boot-sequence');
}

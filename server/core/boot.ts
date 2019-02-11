import * as debug from 'debug';
import * as raven from 'raven';

import app from './app';

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
    });

    server.on('error', raven.captureException);

    log('end boot-sequence');
}

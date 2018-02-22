import * as debug from 'debug';
import * as raven from 'raven';

import app from './app';

const log = debug('lumi:core:boot');

export default function boot() {
    log('start boot-sequence');

    const server = app().listen(process.env.PORT || 80, () => {
        log(
            'express-server successfully booted on port ' + process.env.PORT ||
                80
        );
        raven.captureMessage('server booted', { level: 'info' });
    });

    server.on('error', raven.captureException);

    log('end boot-sequence');
}

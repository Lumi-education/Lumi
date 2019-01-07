import * as raven from 'raven';
import * as debug from 'debug';

const log_info = debug('lumi:info:core:raven');

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

if (process.env.NODE_ENV === 'development') {
    (raven as any).captureException = (exception: Error) => {
        throw exception;
    };
    (raven as any).captureMessage = (message: string) => {
        log_info(message);
    };
}

export default raven;

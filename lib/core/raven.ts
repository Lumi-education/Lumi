import * as raven from 'raven-js';
import * as debug from 'debug';

const log_info = debug('lumi:info:core:raven:message');
const log_error = debug('lumi:error:core:raven:exception');
raven
    .config(
        process.env.NODE_ENV === 'production' ? process.env.SENTRY : undefined,
        {
            release: process.env.VERSION,
            environment: process.env.NODE_ENV,
            tags: {
                component: 'client'
            },
            autoBreadcrumbs: true
        }
    )
    .install();

(raven as any).captureException = (error: Error) => {
    log_error(error);
    throw error;
};
(raven as any).captureMessage = (message: string) => {
    log_info(message);
};

export default (window as any).Raven || raven;

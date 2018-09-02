import * as raven from 'raven-js';

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

export default (window as any).Raven || raven;

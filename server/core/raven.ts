import * as _raven from 'raven';
import * as debug from 'debug';

const log_info = debug('lumi:info:core:raven');
interface IRaven {
    captureException: (exception: Error) => void;
    captureMessage: (message: string, options?: any) => void;
    setContext: (context: any) => void;
}

_raven
    .config(process.env.SENTRY, {
        release: process.env.VERSION,
        environment: process.env.NODE_ENV,
        tags: {
            component: 'server',
            target: process.env.TARGET,
            lumi_id: process.env.LUMI_ID
        },
        autoBreadcrumbs: true
    })
    .install();

const raven: IRaven =
    process.env.NODE_ENV === 'development' || process.env.TARGET === 'electron'
        ? {
              captureException: (exception: Error) => {
                  throw exception;
              },
              captureMessage: (message: string, options?: any) => {
                  log_info(message);
              },
              setContext: (context: any) => {
                  log_info('setContext', context);
              }
          }
        : _raven;

export default raven;

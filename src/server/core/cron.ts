import event from './event';
import * as debug from 'debug';

const log = debug('lumi:core:cron');

// let cron;

export function boot() {
    log('boot start');

    // cron = setInterval(() => {
    //     log('emitting CRON event');
    //     event.emit('CRON');
    // }, process.env.CRON_INTERVAL || 10000);

    log('boot end');
}

// export default cron;

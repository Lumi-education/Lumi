import event from '../../core/event';
import * as debug from 'debug';

const log = debug('lumi:modules:collections:events');

import * as actions from './actions';

export default function boot() {
    event.on('CRON', () => {
        actions.submit_overdue_collections();
    });
}

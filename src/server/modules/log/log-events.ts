import event from '../../core/event';
import * as debug from 'debug';

const log = debug('lumi:modules:log');

export default function boot() {
    event.on('COLLECTIONS/COLLECTION_SUBMITTED', collection => {
        log('COLLECTION_SUBMITTED', collection);
    });
}

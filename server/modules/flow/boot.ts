import * as debug from 'debug';

const log = debug('lumi:modules:flow:boot');

import events from './events';

export default function boot() {
    log('booting flow-module');
    events();
}

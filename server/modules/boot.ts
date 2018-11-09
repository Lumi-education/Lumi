import * as debug from 'debug';

const log = debug('lumi:boot:modules');

import boot_flow from './flow/boot';

export default function boot(done: () => void) {
    log('entering boot-sequence');

    boot_flow();

    done();
}

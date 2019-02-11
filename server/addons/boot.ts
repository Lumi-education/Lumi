import * as debug from 'debug';
import { noop } from 'lodash';
import dns from './dns';
import host from './host';

const log = debug('lumi:addons:boot');

export default function boot(done?: () => void) {
    log('start boot-sequence');

    switch (process.env.TARGET) {
        case 'electron':
        case 'pi':
            dns();
            break;
        default:
            break;
    }

    done ? done() : noop();

    log('end boot-sequence');
}

import * as _debug from 'debug';
import * as superagent from 'superagent';

import check_for_db from './check_for_db';
import setup from './setup';

const debug = _debug('db');

export default function() {
    debug('starting boot-sequence');

    check_for_db(setup);
}

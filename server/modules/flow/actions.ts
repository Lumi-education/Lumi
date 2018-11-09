import { assign as _assign } from 'lodash';
import * as debug from 'debug';

import { IAssignment } from 'lib/flow/types';
import db from '../../db';

const log = debug('lumi:modules:flow:actions');

export function assign(
    user_id: string,
    card_id: string,
    options,
    cb?: (error, assignment) => void
) {
    log('assign');
    const _assignment: IAssignment = {
        user_id,
        card_id,
        type: 'assignment',
        completed: false,
        data: {},
        state: null,
        archived: false,
        finished: null,
        time: null,
        sync: 'success',
        _attachments: {},
        files: []
    };

    _assign(_assignment, options);

    db.insert(_assignment, (err, doc) => {
        log('assign end');
        if (cb) {
            cb(err, doc);
        }
    });
}

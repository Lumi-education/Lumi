import { assign, noop } from 'lodash';
import { DB } from '../../db';
import event from '../../core/event';
import * as bcrypt from 'bcrypt-nodejs';

import { IUser } from 'lib/users/types';
import User from '../../models/User';

export function add_user_to_group(user_id: string, group_id: string) {
    const db = new DB();

    db._findById(user_id + '-groups', (err, group_ref) => {
        if (err) {
            const _group_ref = {
                user_id,
                _id: user_id + '-groups',
                groups: [group_id],
                type: 'group_ref'
            };
            db.insert(_group_ref);
        } else {
            group_ref.groups.push(group_id);
            db.save(group_ref);
        }
        event.emit('GROUPS/USER_ADDED', user_id, group_id);
    });
}

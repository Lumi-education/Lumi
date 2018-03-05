import event from '../../core/event';
import * as debug from 'debug';
import { DB } from '../../db';

import { ISystemSettings } from 'lib/system/types';
import { IUser } from 'lib/users/types';

const log = debug('lumi:modules:collections:events');

import * as actions from './actions';

export default function boot() {
    event.on('USERS/USER_CREATED', (user: IUser) => {
        const db = new DB();

        db.findById('system', (system: ISystemSettings) => {
            system.auto_assign_to_groups.forEach(group_id => {
                actions.add_user_to_group(user._id, group_id);
            });
        });
    });
}

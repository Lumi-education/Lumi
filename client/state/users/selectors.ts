import { Map } from 'immutable';
import { IState } from '../';

import { IUser } from 'lib/types';

export function get_users_by_group(
    state: IState,
    group_id: string
): Array<IUser> {
    return state.users.list.filter(user => user.groups.indexOf(group_id) > -1);
}

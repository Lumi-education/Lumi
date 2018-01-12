import { Map } from 'immutable';
import { IState } from 'client/state';

import { IUser } from './types';

export function get_users_by_group(state: IState, group_id: string): IUser[] {
    return state.users.list.filter(user => user.groups.indexOf(group_id) > -1);
}
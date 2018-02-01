import { Map } from 'immutable';
import { filter } from 'lodash';
import { IUser, IState } from './types';

export function get_users_by_group(state: IState, group_id: string): IUser[] {
    return state.users.list.filter(
        _user => _user.groups.indexOf(group_id) > -1
    );
}

export function users(state: IState, user_ids: string[]): IUser[] {
    return user_ids.map(id => user(state, id));
}

export function user(state: IState, user_id): IUser {
    return (
        state.users.list.filter(u => u._id === user_id)[0] || {
            _id: undefined,
            type: 'user',
            name: 'user not found',
            level: 0,
            groups: [],
            last_active: undefined,
            last_login: undefined,
            online: false,
            location: ''
        }
    );
}

export function query(state: IState, _query): IUser[] {
    return filter(state.users.list, _query);
}

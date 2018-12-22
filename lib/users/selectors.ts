import { IUser, IState } from './types';

export function users(state: IState, user_ids: string[]): IUser[] {
    return user_ids.map(id => user(state, id));
}

export function user(state: IState, user_id): IUser {
    return (
        state.users.list.filter(u => u._id === user_id)[0] || {
            _id: undefined,
            _rev: undefined,
            _deleted: false,
            type: 'user',
            name: 'user not found',
            level: 0,
            groups: [],
            password: undefined,
            flow: [],
            _attachments: {}
        }
    );
}

export function users_in_group(state: IState, group_id: string): IUser[] {
    return state.users.list.filter(
        _user => _user.groups.indexOf(group_id) > -1
    );
}

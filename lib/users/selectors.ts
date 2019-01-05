import { IState } from './types';
import { User } from './models';
import * as Core from 'lib/core';

export function users(state: IState, user_ids: string[]): User[] {
    try {
        return user_ids.map(id => user(state, id));
    } catch (error) {
        Core.raven.captureException(error);
        return [new User()];
    }
}

export function user(state: IState, user_id: string): User {
    try {
        return new User(state.users.list.filter(u => u._id === user_id)[0]);
    } catch (error) {
        Core.raven.captureException(error);
        return new User();
    }
}

export function selected_users(state: IState): User[] {
    try {
        return state.users.list
            .filter(
                _user => state.users.ui.selected_users.indexOf(_user._id) > -1
            )
            .map(_user => new User(_user));
    } catch (error) {
        Core.raven.captureException(error);
        return [new User()];
    }
}

export function users_in_group(state: IState, group_id: string): User[] {
    try {
        return state.users.list
            .filter(_user => _user.groups.indexOf(group_id) > -1)
            .map(_user => new User(_user));
    } catch (error) {
        Core.raven.captureException(error);
        return [new User()];
    }
}

export function dialog(state: IState, key: string): boolean {
    try {
        return state.users.ui.dialogs[key] || false;
    } catch (error) {
        Core.raven.captureException(error);
        return false;
    }
}

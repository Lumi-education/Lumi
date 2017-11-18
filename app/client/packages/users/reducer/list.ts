import { assign, unionBy } from 'lodash';

import { IUser } from 'common/types';

import {
    USERS_ADD_GROUP_REQUEST,
    USERS_REM_GROUP_REQUEST,
    USERS_CREATE_USER_SUCCESS,
    USERS_GET_USERS_SUCCESS,
    USERS_GET_USER_SUCCESS,
    USERS_DELETE_USER_REQUEST,
    GROUPS_DELETE_SUCCESS,
    GROUPS_GET_GROUP_SUCCESS,
    DB_CHANGE
} from 'client/packages/action-types';

export default function(state: IUser[] = [], action): IUser[] {
    switch (action.type) {
        case USERS_ADD_GROUP_REQUEST:
            return state.map(
                u =>
                    u._id === action.payload.user_id
                        ? add_group(u, action.payload.group_id)
                        : u
            );

        case USERS_REM_GROUP_REQUEST:
            return state.map(
                u =>
                    u._id === action.payload.user_id
                        ? rem_group(u, action.payload.group_id)
                        : u
            );
        case GROUPS_DELETE_SUCCESS:
            return state.map(user =>
                assign({}, user, {
                    groups: user.groups.filter(
                        group_id => group_id !== action.group_id
                    )
                })
            );

        case USERS_CREATE_USER_SUCCESS:
            return [...state, action.payload];

        case USERS_GET_USER_SUCCESS:
            return unionBy([action.payload.user], state, '_id');

        case USERS_GET_USERS_SUCCESS:
        case GROUPS_GET_GROUP_SUCCESS:
            return unionBy(action.payload.users, state, '_id');

        case USERS_DELETE_USER_REQUEST:
            return state.filter(u => u._id !== action.payload.user_id);

        case DB_CHANGE:
            return unionBy(
                action.payload.filter(d => d.type === 'user'),
                state,
                '_id'
            );

        default:
            return state;
    }
}

export function add_group(user: IUser, group_id: string) {
    return assign({}, user, { groups: [...user.groups, group_id] });
}

export function rem_group(user: IUser, group_id: string) {
    return assign({}, user, {
        groups: user.groups.filter(g => g !== group_id)
    });
}

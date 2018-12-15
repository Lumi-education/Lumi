import { assign, unionBy } from 'lodash';

import { IUser } from '../types';

import {
    USERS_ADD_GROUP_REQUEST,
    USERS_REM_GROUP_REQUEST,
    USERS_CREATE_USER_SUCCESS,
    USERS_GET_USERS_SUCCESS,
    USERS_GET_USER_SUCCESS,
    USERS_DELETE_USER_REQUEST,
    USERS_UPDATE_USER_REQUEST
} from '../actions';

import * as Flow from '../../flow';
import * as Activity from 'lib/activity';
import * as Groups from '../../groups';

export default function(state: IUser[] = [], action): IUser[] {
    switch (action.type) {
        case USERS_ADD_GROUP_REQUEST:
            return state.map(u =>
                u._id === action.payload.user_id
                    ? add_group(u, action.payload.group_id)
                    : u
            );

        case USERS_REM_GROUP_REQUEST:
            return state.map(u =>
                u._id === action.payload.user_id
                    ? rem_group(u, action.payload.group_id)
                    : u
            );

        case USERS_UPDATE_USER_REQUEST:
            return state.map(user =>
                user._id === action.payload.user_id
                    ? update_user(user, action.payload.update)
                    : user
            );

        case USERS_CREATE_USER_SUCCESS:
            return [...state, ...action.payload];

        case USERS_DELETE_USER_REQUEST:
            return state.filter(u => u._id !== action.payload.user_id);

        case 'DB_CHANGE':
        case Activity.actions.ACTIVITY_GET_SUCCESS:
        case Flow.actions.FLOW_ARCHIVE_ASSIGNMENT_SUCCESS:
        case USERS_GET_USERS_SUCCESS:
        case Groups.actions.GROUPS_ASSIGN_GROUPS_SUCCESS:
        case Groups.actions.GROUPS_REMOVE_USERS_FROM_GROUPS_SUCCESS:
        case Flow.actions.FLOW_DELETE_ASSIGNMENT_SUCCESS:
        case USERS_GET_USER_SUCCESS:
            return unionBy(
                action.payload.filter(d => d.type === 'user'),
                state,
                '_id'
            ).filter(user => !user._deleted);

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

export function update_user(user: IUser, update): IUser {
    return assign({}, user, update);
}

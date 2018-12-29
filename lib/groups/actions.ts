export const GROUPS_CREATE_REQUEST = 'GROUPS_CREATE_REQUEST';
export const GROUPS_CREATE_SUCCESS = 'GROUPS_CREATE_SUCCESS';
export const GROUPS_CREATE_ERROR = 'GROUPS_CREATE_ERROR';
export const GROUPS_DELETE_REQUEST = 'GROUPS_DELETE_REQUEST';
export const GROUPS_DELETE_SUCCESS = 'GROUPS_DELETE_SUCCESS';
export const GROUPS_DELETE_ERROR = 'GROUPS_DELETE_ERROR';
export const GROUPS_UPDATE_GROUP_REQUEST = 'GROUPS_UPDATE_GROUP_REQUEST';
export const GROUPS_UPDATE_GROUP_SUCCESS = 'GROUPS_UPDATE_GROUP_SUCCESS';
export const GROUPS_UPDATE_GROUP_ERROR = 'GROUPS_UPDATE_GROUP_ERROR';

export const GROUPS_UI_RESET_GROUP = 'GROUPS_UI_RESET_GROUP';
export const GROUPS_SELECT_GROUP = 'GROUPS_SELECT_GROUP'; // deprecate with universal selection module #286
export const GROUPS_UI_SET_SELECTED_GROUPS = 'GROUPS_UI_SET_SELECTED_GROUPS'; // deprecate with universal selection module #286
export const GROUPS_UI_CHANGE_GROUP = 'GROUPS_UI_CHANGE_GROUP';

import * as DB from 'lib/db';
import * as debug from 'debug';

import { IGroup } from './types';
import { Group } from './models';

import * as Core from 'lib/core';
import * as Users from 'lib/users';

const log_info = debug('lumi:info:groups:actions');
const log_error = debug('lumi:error:groups:actions');

export function remove_users_from_groups(
    user: Users.models.User,
    group: Group
) {
    return dispatch => {
        user.groups = user.groups.filter(group_id => group_id !== group._id);
        dispatch(Core.actions.update<Users.models.User>(user));
    };
}

export function add_users_to_group(users: Users.models.User[], group: Group) {
    return dispatch => {
        const _users = users.map(user => {
            user.groups.push(group._id);
            return user;
        });

        dispatch(Core.actions.update_many<Users.models.User>(_users));
    };
}

export function create_group(group: Group, existing_groupnames: string[]) {
    log_info('create_group');
    return dispatch => {
        if (existing_groupnames.indexOf(group.name) > -1) {
            log_error('create_group', 'groups_conflict');
            return dispatch({
                type: GROUPS_CREATE_ERROR,
                payload: { group, message: 'groups_conflict' }
            });
        }

        if (group.name === '') {
            log_error('create_group', 'groups.no_name');
            return dispatch({
                type: GROUPS_CREATE_ERROR,
                payload: { group, message: 'groups_no_name' }
            });
        }

        return dispatch({
            types: [
                GROUPS_CREATE_REQUEST,
                GROUPS_CREATE_SUCCESS,
                GROUPS_CREATE_ERROR
            ],
            api: DB.api.create<IGroup>(group),
            payload: [group]
        });
    };
}

// export function delete_group(group_id: string) {
//     return {
//         types: [
//             GROUPS_DELETE_REQUEST,
//             GROUPS_DELETE_SUCCESS,
//             GROUPS_DELETE_ERROR
//         ],
//         api: API.delete_group(group_id),
//         payload: { group_id }
//     };
// }
export function select_group(group_id: string) {
    // deprecate with universal selection module #286

    return {
        type: GROUPS_SELECT_GROUP,
        payload: { group_id }
    };
}

export function set_selected_groups(group_ids: string[]) {
    // deprecate with universal selection module #286

    return {
        group_ids,
        type: GROUPS_UI_SET_SELECTED_GROUPS,
        payload: { group_ids }
    };
}

export function change_group(payload) {
    return {
        payload,
        type: GROUPS_UI_CHANGE_GROUP
    };
}

export function reset_ui_group() {
    return {
        type: GROUPS_UI_RESET_GROUP
    };
}

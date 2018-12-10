export const GROUPS_GET_USER_GROUPS_REQUEST = 'GROUPS_GET_USER_GROUPS_REQUEST';
export const GROUPS_GET_USER_GROUPS_SUCCESS = 'GROUPS_GET_USER_GROUPS_SUCCESS';
export const GROUPS_GET_USER_GROUPS_ERROR = 'GROUPS_GET_USER_GROUPS_ERROR';
export const GROUPS_CREATE_REQUEST = 'GROUPS_CREATE_REQUEST';
export const GROUPS_CREATE_SUCCESS = 'GROUPS_CREATE_SUCCESS';
export const GROUPS_CREATE_ERROR = 'GROUPS_CREATE_ERROR';
export const GROUPS_ENABLE_COLLECTION_REQUEST =
    'GROUPS_ENABLE_COLLECTION_REQUEST';
export const GROUPS_ENABLE_COLLECTION_SUCCESS =
    'GROUPS_ENABLE_COLLECTION_SUCCESS';
export const GROUPS_ENABLE_COLLECTION_ERROR = 'GROUPS_ENABLE_COLLECTION_ERROR';
export const GROUPS_DISABLE_COLLECTION_REQUEST =
    'GROUPS_DISABLE_COLLECTION_REQUEST';
export const GROUPS_DISABLE_COLLECTION_SUCCESS =
    'GROUPS_DISABLE_COLLECTION_SUCCESS';
export const GROUPS_DISABLE_COLLECTION_ERROR =
    'GROUPS_DISABLE_COLLECTION_ERROR';
export const GROUPS_DELETE_REQUEST = 'GROUPS_DELETE_REQUEST';
export const GROUPS_DELETE_SUCCESS = 'GROUPS_DELETE_SUCCESS';
export const GROUPS_DELETE_ERROR = 'GROUPS_DELETE_ERROR';
export const GROUPS_GET_GROUP_REQUEST = 'GROUPS_GET_GROUP_REQUEST';
export const GROUPS_GET_GROUP_SUCCESS = 'GROUPS_GET_GROUP_SUCCESS';
export const GROUPS_GET_GROUP_ERROR = 'GROUPS_GET_GROUP_ERROR';
export const GROUPS_GET_GROUPS_REQUEST = 'GROUPS_GET_GROUPS_REQUEST';
export const GROUPS_GET_GROUPS_SUCCESS = 'GROUPS_GET_GROUPS_SUCCESS';
export const GROUPS_GET_GROUPS_ERROR = 'GROUPS_GET_GROUPS_ERROR';
export const GROUPS_ADD_COLLECTION_REQUEST = 'GROUPS_ADD_COLLECTION_REQUEST';
export const GROUPS_ADD_COLLECTION_SUCCESS = 'GROUPS_ADD_COLLECTION_SUCCESS';
export const GROUPS_ADD_COLLECTION_ERROR = 'GROUPS_ADD_COLLECTION_ERROR';
export const GROUPS_REM_COLLECTION_REQUEST = 'GROUPS_REM_COLLECTION_REQUEST';
export const GROUPS_REM_COLLECTION_SUCCESS = 'GROUPS_REM_COLLECTION_SUCCESS';
export const GROUPS_REM_COLLECTION_ERROR = 'GROUPS_REM_COLLECTION_ERROR';
export const GROUPS_ADD_GROUP_REQUEST = 'GROUPS_ADD_GROUP_REQUEST';
export const GROUPS_ADD_GROUP_SUCCESS = 'GROUPS_ADD_GROUP_SUCCESS';
export const GROUPS_ADD_GROUP_ERROR = 'GROUPS_ADD_GROUP_ERROR';
export const GROUPS_REM_GROUP_REQUEST = 'GROUPS_REM_GROUP_REQUEST';
export const GROUPS_REM_GROUP_SUCCESS = 'GROUPS_REM_GROUP_SUCCESS';
export const GROUPS_REM_GROUP_ERROR = 'GROUPS_REM_GROUP_ERROR';
export const GROUPS_UPDATE_GROUP_REQUEST = 'GROUPS_UPDATE_GROUP_REQUEST';
export const GROUPS_UPDATE_GROUP_SUCCESS = 'GROUPS_UPDATE_GROUP_SUCCESS';
export const GROUPS_UPDATE_GROUP_ERROR = 'GROUPS_UPDATE_GROUP_ERROR';

export const GROUPS_ASSIGN_GROUPS_REQUEST = 'GROUPS_ASSIGN_GROUPS_REQUEST';
export const GROUPS_ASSIGN_GROUPS_SUCCESS = 'GROUPS_ASSIGN_GROUPS_SUCCESS';
export const GROUPS_ASSIGN_GROUPS_ERROR = 'GROUPS_ASSIGN_GROUPS_ERROR';
export const GROUPS_REMOVE_USERS_FROM_GROUPS_REQUEST =
    'GROUPS_REMOVE_USERS_FROM_GROUPS_REQUEST';
export const GROUPS_REMOVE_USERS_FROM_GROUPS_SUCCESS =
    'GROUPS_REMOVE_USERS_FROM_GROUPS_SUCCESS';
export const GROUPS_REMOVE_USERS_FROM_GROUPS_ERROR =
    'GROUPS_REMOVE_USERS_FROM_GROUPS_ERROR';

export const GROUPS_SELECT_GROUP = 'GROUPS_SELECT_GROUP';
export const GROUPS_UI_SET_SELECTED_GROUPS = 'GROUPS_UI_SET_SELECTED_GROUPS';
export const GROUPS_UI_CHANGE_GROUP = 'GROUPS_UI_CHANGE_GROUP';

export const GROUPS_ADD_CARDS_REQUEST = 'GROUPS_ADD_CARDS_REUQEST';
export const GROUPS_ADD_CARDS_SUCCESS = 'GROUPS_ADD_CARDS_SUCCESS';
export const GROUPS_ADD_CARDS_ERROR = 'GROUPS_ADD_CARDS_ERROR';
import * as API from './api';

import { IGroup } from './types';

export function assign_groups(user_ids: string[], group_ids: string[]) {
    return {
        types: [
            GROUPS_ASSIGN_GROUPS_REQUEST,
            GROUPS_ASSIGN_GROUPS_SUCCESS,
            GROUPS_ASSIGN_GROUPS_ERROR
        ],
        api: API.assign_groups(user_ids, group_ids),
        payload: { payload: { user_ids, group_ids } }
    };
}

export function remove_users_from_groups(
    user_ids: string[],
    group_ids: string[]
) {
    return {
        types: [
            GROUPS_REMOVE_USERS_FROM_GROUPS_REQUEST,
            GROUPS_REMOVE_USERS_FROM_GROUPS_SUCCESS,
            GROUPS_REMOVE_USERS_FROM_GROUPS_ERROR
        ],
        api: API.remove_users_from_groups(user_ids, group_ids),
        payload: { payload: { user_ids, group_ids } }
    };
}

export function create_group(name: string) {
    const group: IGroup = {
        name,
        _id: undefined,
        type: 'group',
        created_at: new Date(),
        autojoin: false,
        cards: []
    };
    return {
        types: [
            GROUPS_CREATE_REQUEST,
            GROUPS_CREATE_SUCCESS,
            GROUPS_CREATE_ERROR
        ],
        api: API.create_group(group),
        payload: { group }
    };
}

export function delete_group(group_id: string) {
    return {
        types: [
            GROUPS_DELETE_REQUEST,
            GROUPS_DELETE_SUCCESS,
            GROUPS_DELETE_ERROR
        ],
        api: API.delete_group(group_id),
        payload: { group_id }
    };
}

export function get_groups() {
    return {
        types: [
            GROUPS_GET_GROUPS_REQUEST,
            GROUPS_GET_GROUPS_SUCCESS,
            GROUPS_GET_GROUPS_ERROR
        ],
        api: API.get_groups()
    };
}

export function get_group(group_id: string) {
    return {
        types: [
            GROUPS_GET_GROUP_REQUEST,
            GROUPS_GET_GROUP_SUCCESS,
            GROUPS_GET_GROUP_ERROR
        ],
        api: API.get_group(group_id),
        payload: { group_id }
    };
}

export function get_user_groups(user_id: string) {
    return {
        types: [
            GROUPS_GET_USER_GROUPS_REQUEST,
            GROUPS_GET_USER_GROUPS_SUCCESS,
            GROUPS_GET_USER_GROUPS_ERROR
        ],
        api: API.get_user_groups(user_id),
        payload: { user_id }
    };
}

export function update_group(group_id: string, update) {
    return {
        types: [
            GROUPS_UPDATE_GROUP_REQUEST,
            GROUPS_UPDATE_GROUP_SUCCESS,
            GROUPS_UPDATE_GROUP_ERROR
        ],
        api: API.update_group(group_id, update),
        payload: { group_id, update }
    };
}

export function select_group(group_id: string) {
    return {
        type: GROUPS_SELECT_GROUP,
        payload: { group_id }
    };
}

export function set_selected_groups(group_ids: string[]) {
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

export function add_cards(group_id: string, card_ids: string[]) {
    return {
        types: [
            GROUPS_ADD_CARDS_REQUEST,
            GROUPS_ADD_CARDS_SUCCESS,
            GROUPS_ADD_CARDS_ERROR
        ],
        api: API.add_cards(group_id, card_ids),
        payload: { group_id, card_ids }
    };
}

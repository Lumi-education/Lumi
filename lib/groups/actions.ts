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

export const GROUPS_SELECT_GROUP = 'GROUPS_SELECT_GROUP';

import * as API from './api';

export function add_group(user_id: string, group_id: string) {
    return {
        types: [
            GROUPS_ADD_GROUP_REQUEST,
            GROUPS_ADD_GROUP_SUCCESS,
            GROUPS_ADD_GROUP_ERROR
        ],
        api: API.add_group(user_id, group_id),
        payload: { payload: { user_id, group_id } }
    };
}

export function rem_group(user_id: string, group_id: string) {
    return {
        types: [
            GROUPS_REM_GROUP_REQUEST,
            GROUPS_REM_GROUP_SUCCESS,
            GROUPS_REM_GROUP_ERROR
        ],
        api: API.rem_group(user_id, group_id),
        payload: { payload: { user_id, group_id } }
    };
}

export function create_group(name: string) {
    return {
        types: [
            GROUPS_CREATE_REQUEST,
            GROUPS_CREATE_SUCCESS,
            GROUPS_CREATE_ERROR
        ],
        api: API.create_group(name),
        payload: { payload: { name } }
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

export function create_and_add_group(user_id: string, group_name: string) {
    return dispatch => {
        API.create_group(group_name)
            .then(res => {
                dispatch({ type: GROUPS_CREATE_SUCCESS, payload: res.body });
                dispatch(add_group(user_id, res.body._id));
            })
            .catch();
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

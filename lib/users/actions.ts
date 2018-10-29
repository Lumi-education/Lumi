import * as API from './api';

export const USERS_ADD_GROUP_REQUEST = 'USERS_ADD_GROUP_REQUEST';
export const USERS_ADD_GROUP_SUCCESS = 'USERS_ADD_GROUP_SUCCESS';
export const USERS_ADD_GROUP_ERROR = 'USERS_ADD_GROUP_ERROR';
export const USERS_REM_GROUP_REQUEST = 'USERS_REM_GROUP_REQUEST';
export const USERS_REM_GROUP_SUCCESS = 'USERS_REM_GROUP_SUCCESS';
export const USERS_REM_GROUP_ERROR = 'USERS_REM_GROUP_ERROR';
export const USERS_CREATE_USER_REQUEST = 'USERS_CREATE_USER_REQUEST';
export const USERS_CREATE_USER_SUCCESS = 'USERS_CREARE_USER_SUCCESS';
export const USERS_CREATE_USER_ERROR = 'USERS_CREARE_USER_ERROR';
export const USERS_GET_USER_REQUEST = 'USERS_GET_USER_REQUEST';
export const USERS_GET_USER_SUCCESS = 'USERS_GET_USER_SUCCESS';
export const USERS_GET_USER_ERROR = 'USERS_GET_USER_ERROR';
export const USERS_GET_USERS_REQUEST = 'USERS_GET_USERS_REQUEST';
export const USERS_GET_USERS_SUCCESS = 'USERS_GET_USERS_SUCCESS';
export const USERS_GET_USERS_ERROR = 'USERS_GET_USERS_ERROR';
export const USERS_DELETE_USER_REQUEST = 'USERS_DELETE_USER_REQUEST';
export const USERS_DELETE_USER_SUCCESS = 'USERS_DELETE_USER_SUCCESS';
export const USERS_DELETE_USER_ERROR = 'USERS_DELETE_USER_ERROR';
export const USERS_UPDATE_USER_REQUEST = 'USERS_UPDATE_USER_REQUEST';
export const USERS_UPDATE_USER_SUCCESS = 'USERS_UPDATE_USER_SUCCESS';
export const USERS_UPDATE_USER_ERROR = 'USERS_UPDATE_USER_ERROR';
export const USERS_UI_SELECT = 'USERS_UI_SELECT';
export const USERS_UI_SELECTION_RESET = 'USERS_UI_SELECTION_RESET';
export const USERS_UI_SET_SELECTED_USERS = 'USERS_UI_SET_SELECTED_USERS';
export const USERS_INIT_USER_REQUEST = 'USERS_INIT_USER_REQUEST';
export const USERS_INIT_USER_SUCCESS = 'USERS_INIT_USER_SUCCESS';
export const USERS_INIT_USER_ERROR = 'USERS_INIT_USER_ERROR';
export const USERS_UI_CHANGE_USER = 'USERS_UI_CHANGE_USER';

export function create_user(name: string, options?) {
    return {
        types: [
            USERS_CREATE_USER_REQUEST,
            USERS_CREATE_USER_SUCCESS,
            USERS_CREATE_USER_ERROR
        ],
        api: API.create_user(name, options),
        payload: { payload: { name } }
    };
}

export function get_users(user_ids?: string[]) {
    return {
        types: [
            USERS_GET_USERS_REQUEST,
            USERS_GET_USERS_SUCCESS,
            USERS_GET_USERS_ERROR
        ],
        api: API.get_users(user_ids),
        payload: { user_ids }
    };
}

export function get_user(user_id: string) {
    return {
        types: [
            USERS_GET_USER_REQUEST,
            USERS_GET_USER_SUCCESS,
            USERS_GET_USER_ERROR
        ],
        api: API.get_user(user_id),
        payload: { payload: { user_id } }
    };
}

export function delete_user(user_ids: string[]) {
    return {
        types: [
            USERS_DELETE_USER_REQUEST,
            USERS_DELETE_USER_SUCCESS,
            USERS_DELETE_USER_ERROR
        ],
        api: API.delete_user(user_ids),
        payload: { payload: { user_ids } }
    };
}

export function update_user(user_id: string, update) {
    return {
        types: [
            USERS_UPDATE_USER_REQUEST,
            USERS_UPDATE_USER_SUCCESS,
            USERS_UPDATE_USER_ERROR
        ],
        api: API.update_user(user_id, update),
        payload: { payload: { user_id, update } }
    };
}

export function select_user(user_id: string) {
    return {
        type: USERS_UI_SELECT,
        payload: { user_id }
    };
}

export function selection_reset() {
    return {
        type: USERS_UI_SELECTION_RESET
    };
}

export function set_selected_users(user_ids: string[]) {
    return {
        type: USERS_UI_SET_SELECTED_USERS,
        payload: { user_ids }
    };
}

export function init_user() {
    return {
        types: [
            USERS_INIT_USER_REQUEST,
            USERS_INIT_USER_SUCCESS,
            USERS_INIT_USER_ERROR
        ],
        api: API.init_user(),
        payload: {}
    };
}

export function change_user(payload: any) {
    return {
        payload,
        type: USERS_UI_CHANGE_USER
    };
}

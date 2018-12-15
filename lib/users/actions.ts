import * as debug from 'debug';
import * as API from './api';
import { User } from './models';

import store from 'client/store';

const log_info = debug('lumi:info:users:actions');
const log_error = debug('lumi:error:users:actions');

export const USERS_ADD_GROUP_REQUEST = 'USERS_ADD_GROUP_REQUEST';
export const USERS_ADD_GROUP_SUCCESS = 'USERS_ADD_GROUP_SUCCESS';
export const USERS_ADD_GROUP_ERROR = 'USERS_ADD_GROUP_ERROR';
export const USERS_REM_GROUP_REQUEST = 'USERS_REM_GROUP_REQUEST';
export const USERS_REM_GROUP_SUCCESS = 'USERS_REM_GROUP_SUCCESS';
export const USERS_REM_GROUP_ERROR = 'USERS_REM_GROUP_ERROR';
export const USERS_CREATE_USER_REQUEST = 'USERS_CREATE_USER_REQUEST';
export const USERS_CREATE_USER_SUCCESS = 'USERS_CREARE_USER_SUCCESS';
export const USERS_CREATE_USER_ERROR = 'USERS_CREATE_USER_ERROR';
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
export const USERS_UPDATE_MYSELF_REQUEST = 'USERS_UPDATE_MYSELF_REQUEST';
export const USERS_UPDATE_MYSELF_SUCCESS = 'USERS_UPDATE_MYSELF_SUCCESS';
export const USERS_UPDATE_MYSELF_ERROR = 'USERS_UPDATE_MYSELF_ERROR';
export const USERS_UI_SET_USERNAME_TO_CREATE =
    'USERS_UI_SET_USERNAME_TO_CREATE';
export const USERS_UI_ADD_USER_TO_CREATE = 'USERS_UI_ADD_USER_TO_CREATE';
export const USERS_UI_ADD_USER_TO_CREATE_ERROR =
    'USERS_UI_ADD_USER_TO_CREATE_ERROR';
export const USERS_UI_REMOVE_USER_FROM_CREATE =
    'USERS_UI_REMOVE_USER_FROM_CREATE';

export function create_users(users: User[]) {
    log_info('create_users', users);
    return {
        types: [
            USERS_CREATE_USER_REQUEST,
            USERS_CREATE_USER_SUCCESS,
            USERS_CREATE_USER_ERROR
        ],
        api: API.create_users(users),
        payload: users
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
        payload: { user_id }
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
        payload: { user_ids }
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
        payload: { user_id, update }
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

export function update_myself(update) {
    return {
        types: [
            USERS_UPDATE_MYSELF_REQUEST,
            USERS_UPDATE_MYSELF_SUCCESS,
            USERS_UPDATE_MYSELF_ERROR
        ],
        api: API.update_myself(update),
        payload: { update }
    };
}

export function set_username_to_create(username: string) {
    log_info('set_username_to_create', username);

    return {
        type: USERS_UI_SET_USERNAME_TO_CREATE,
        payload: username
    };
}

export function add_user_to_create(
    username: string,
    existing_usernames: string[]
) {
    log_info('add_user_to_create', username, existing_usernames);
    return dispatch => {
        if (username === '') {
            log_info('add_user_to_create', 'no username provided');
            dispatch({
                type: USERS_UI_ADD_USER_TO_CREATE_ERROR,
                payload: { message: 'users_conflict' }
            });
            return;
        }

        if (existing_usernames.indexOf(username) > -1) {
            log_info('add_user_to_create', 'users.conflict', username);
            dispatch({
                type: USERS_UI_ADD_USER_TO_CREATE_ERROR,
                payload: { message: 'users_conflict' }
            });
            return;
        }

        dispatch({
            type: USERS_UI_ADD_USER_TO_CREATE,
            payload: username
        });
    };
}

export function remove_user_from_create(username: string) {
    log_info('remove_user_from_create', username);
    return {
        type: USERS_UI_REMOVE_USER_FROM_CREATE,
        payload: username
    };
}

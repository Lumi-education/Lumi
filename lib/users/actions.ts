import * as shortid from 'shortid';

import * as API from './api';

import { IUser } from './types';

import {
    USERS_ADD_GROUP_REQUEST,
    USERS_ADD_GROUP_SUCCESS,
    USERS_ADD_GROUP_ERROR,
    USERS_REM_GROUP_REQUEST,
    USERS_REM_GROUP_SUCCESS,
    USERS_REM_GROUP_ERROR,
    USERS_CREATE_USER_REQUEST,
    USERS_CREATE_USER_SUCCESS,
    USERS_CREATE_USER_ERROR,
    USERS_GET_USERS_REQUEST,
    USERS_GET_USERS_SUCCESS,
    USERS_GET_USERS_ERROR,
    USERS_GET_USER_REQUEST,
    USERS_GET_USER_SUCCESS,
    USERS_GET_USER_ERROR,
    USERS_DELETE_USER_REQUEST,
    USERS_DELETE_USER_SUCCESS,
    USERS_DELETE_USER_ERROR,
    USERS_UPDATE_USER_REQUEST,
    USERS_UPDATE_USER_SUCCESS,
    USERS_UPDATE_USER_ERROR
} from './constants';

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

export function get_users(id = shortid()) {
    return {
        types: [
            USERS_GET_USERS_REQUEST,
            USERS_GET_USERS_SUCCESS,
            USERS_GET_USERS_ERROR
        ],
        api: API.get_users(),
        payload: { id }
    };
}

export function get_user(user_id: string, id = shortid()) {
    return {
        types: [
            USERS_GET_USER_REQUEST,
            USERS_GET_USER_SUCCESS,
            USERS_GET_USER_ERROR
        ],
        api: API.get_user(user_id),
        payload: { id, payload: { user_id } }
    };
}

export function delete_user(user_id: string, id = shortid()) {
    return {
        types: [
            USERS_DELETE_USER_REQUEST,
            USERS_DELETE_USER_SUCCESS,
            USERS_DELETE_USER_ERROR
        ],
        api: API.delete_user(user_id),
        payload: { id, payload: { user_id } }
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
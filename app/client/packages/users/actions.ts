import * as shortid from 'shortid';

import * as API from './api';

import { IUser } from 'common/types';

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
    USERS_DELETE_USER_ERROR
} from '../action-types';

export function add_group(user_id: string, group_id: string) {
    return {
        types: [
            USERS_ADD_GROUP_REQUEST,
            USERS_ADD_GROUP_SUCCESS,
            USERS_ADD_GROUP_ERROR
        ],
        api: API.add_group(user_id, group_id),
        payload: { payload: { user_id, group_id } }
    };
}

export function rem_group(user_id: string, group_id: string) {
    return {
        types: [
            USERS_REM_GROUP_REQUEST,
            USERS_REM_GROUP_SUCCESS,
            USERS_REM_GROUP_ERROR
        ],
        api: API.rem_group(user_id, group_id),
        payload: { payload: { user_id, group_id } }
    };
}

export function create_user(name: string, options?, id = shortid()) {
    return {
        types: [
            USERS_CREATE_USER_REQUEST,
            USERS_CREATE_USER_SUCCESS,
            USERS_CREATE_USER_ERROR
        ],
        api: API.create_user(name, options),
        payload: { id, payload: { name } }
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

import * as shortid from 'shortid';

import {
    GROUPS_CREATE_REQUEST,
    GROUPS_CREATE_SUCCESS,
    GROUPS_CREATE_ERROR,
    GROUPS_DELETE_REQUEST,
    GROUPS_DELETE_SUCCESS,
    GROUPS_DELETE_ERROR,
    GROUPS_GET_GROUPS_REQUEST,
    GROUPS_GET_GROUPS_SUCCESS,
    GROUPS_GET_GROUPS_ERROR,
    GROUPS_GET_GROUP_REQUEST,
    GROUPS_GET_GROUP_SUCCESS,
    GROUPS_GET_GROUP_ERROR,
    GROUPS_ADD_COLLECTION_REQUEST,
    GROUPS_ADD_COLLECTION_SUCCESS,
    GROUPS_ADD_COLLECTION_ERROR,
    GROUPS_REM_COLLECTION_REQUEST,
    GROUPS_REM_COLLECTION_SUCCESS,
    GROUPS_REM_COLLECTION_ERROR
} from 'client/state/action-types';

import { add_group } from 'client/state/users/actions';

import * as API from './api';

export function add_collection_to_group(
    group_id: string,
    collection_id: string,
    id = shortid()
) {
    return {
        types: [
            GROUPS_ADD_COLLECTION_REQUEST,
            GROUPS_ADD_COLLECTION_SUCCESS,
            GROUPS_ADD_COLLECTION_ERROR
        ],
        api: API.add_collection_to_group(group_id, collection_id),
        payload: { id, group_id, collection_id }
    };
}

export function rem_collection_from_group(
    group_id: string,
    collection_id: string
) {
    return {
        types: [
            GROUPS_REM_COLLECTION_REQUEST,
            GROUPS_REM_COLLECTION_SUCCESS,
            GROUPS_REM_COLLECTION_ERROR
        ],
        api: API.rem_collection_from_group(group_id, collection_id),
        payload: { group_id, collection_id }
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

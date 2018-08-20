export const SYSTEM_SHUTDOWN = 'SYSTEM_SHUTDOWN';
export const SYSTEM_GET_SETTINGS_REQUEST = 'SYSTEM_GET_SETTINGS_REQUEST';
export const SYSTEM_GET_SETTINGS_SUCCESS = 'SYSTEM_GET_SETTINGS_SUCCESS';
export const SYSTEM_GET_SETTINGS_ERROR = 'SYSTEM_GET_SETTINGS_ERROR';

export const CORE_DB_FIND_REQUEST = 'CORE_DB_FIND_REQUEST';
export const CORE_DB_FIND_SUCCESS = 'CORE_DB_FIND_SUCCESS';
export const CORE_DB_FIND_ERROR = 'CORE_DB_FIND_ERROR';
export const CORE_DB_CHANGE = 'DB_CHANGE';
export const CORE_DB_UPDATE_REQUEST = 'CORE_DB_UPDATE_REQUEST';
export const CORE_DB_UPDATE_ERROR = 'CORE_DB_UPDATE_ERROR';
export const CORE_ACTION_REQUEST = 'CORE_ACTION_REQUEST';
export const CORE_ACTION_SUCCESS = 'CORE_ACTION_SUCCESS';
export const CORE_ACTION_ERROR = 'CORE_ACTION_ERROR';
export const CORE_DOC_REQUEST = 'CORE_DOC_REQUEST';
export const CORE_DOC_ERROR = 'CORE_DOC_ERROR';

import * as API from './api';

export function find(query, options?) {
    return {
        types: [CORE_DB_FIND_REQUEST, CORE_DB_CHANGE, CORE_DB_FIND_ERROR],
        api: API.find(query, options),
        payload: {
            query,
            options
        }
    };
}

export function get(id: string) {
    return {
        types: [CORE_DOC_REQUEST, CORE_DB_CHANGE, CORE_DOC_ERROR],
        api: API.doc(id),
        payload: {
            id
        }
    };
}

export function update(ids: string[], _update) {
    return {
        types: [CORE_DB_UPDATE_REQUEST, CORE_DB_CHANGE, CORE_DB_UPDATE_ERROR],
        api: API.update(ids, _update),
        payload: {
            ids,
            update: _update
        }
    };
}

export function shutdown() {
    return dispatch => {
        API.shutdown().then(res => {
            dispatch({type: SYSTEM_SHUTDOWN});
        });
    };
}

export function get_settings() {
    return {
        types: [
            SYSTEM_GET_SETTINGS_REQUEST,
            SYSTEM_GET_SETTINGS_SUCCESS,
            SYSTEM_GET_SETTINGS_ERROR
        ],
        api: API.get_settings(),
        payload: {}
    };
}

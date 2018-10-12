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

export const CORE_PING_REQUEST = 'CORE_PING_REQUEST';
export const CORE_PING_SUCCESS = 'CORE_PING_SUCCESS';
export const CORE_PING_ERROR = 'CORE_PING_ERROR';

export const CORE_GET_ENV_REQUEST = 'CORE_GET_ENV_REQUEST';
export const CORE_GET_ENV_SUCCESS = 'CORE_GET_ENV_SUCCESS';
export const CORE_GET_ENV_ERROR = 'CORE_GET_ENV_ERROR';

export const CORE_UPDATE_ENV_REQUEST = 'CORE_UPDATE_ENV_REQUEST';
export const CORE_UPDATE_ENV_SUCCESS = 'CORE_UPDATE_ENV_SUCCESS';
export const CORE_UPDATE_ENV_ERROR = 'CORE_UPDATE_ENV_ERROR';

export const CORE_CHECK_UPDATE_REQUEST = 'CORE_CHECK_UPDATE_REQUEST';
export const CORE_CHECK_UPDATE_SUCCESS = 'CORE_CHECK_UPDATE_SUCCESS';
export const CORE_CHECK_UPDATE_ERROR = 'CORE_CHECK_UPDATE_ERROR';

export const CORE_UPDATE_SYSTEM_REQUEST = 'CORE_UPDATE_SYSTEM_REQUEST';
export const CORE_UPDATE_SYSTEM_SUCCESS = 'CORE_UPDATE_SYSTEM_SUCCESS';
export const CORE_UPDATE_SYSTEM_ERROR = 'CORE_UPDATE_SYSTEM_ERROR';

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

export function update(id: string, _update) {
    return {
        types: [CORE_DB_UPDATE_REQUEST, CORE_DB_CHANGE, CORE_DB_UPDATE_ERROR],
        api: API.update(id, _update),
        payload: {
            id,
            update: _update
        }
    };
}

export function shutdown() {
    return dispatch => {
        API.shutdown().then(res => {
            dispatch({ type: SYSTEM_SHUTDOWN });
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

export function ping() {
    return {
        types: [CORE_PING_REQUEST, CORE_PING_SUCCESS, CORE_PING_ERROR],
        api: API.ping()
    };
}

export function get_env() {
    return {
        types: [CORE_GET_ENV_REQUEST, CORE_GET_ENV_SUCCESS, CORE_GET_ENV_ERROR],
        api: API.env()
    };
}

export function update_env(env) {
    return {
        types: [
            CORE_UPDATE_ENV_REQUEST,
            CORE_UPDATE_ENV_SUCCESS,
            CORE_UPDATE_ENV_ERROR
        ],
        api: API.update_env(env)
    };
}

export function check_update() {
    return {
        types: [
            CORE_CHECK_UPDATE_REQUEST,
            CORE_CHECK_UPDATE_SUCCESS,
            CORE_CHECK_UPDATE_ERROR
        ],
        api: API.check_update()
    };
}

export function update_system() {
    return {
        types: [
            CORE_UPDATE_SYSTEM_REQUEST,
            CORE_UPDATE_SYSTEM_SUCCESS,
            CORE_UPDATE_SYSTEM_ERROR
        ],
        api: API.update_system()
    };
}

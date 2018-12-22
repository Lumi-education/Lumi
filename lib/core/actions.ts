import * as debug from 'debug';

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

export const CORE_INSTALL_ADMIN_REQUEST = 'CORE_INSTALL_ADMIN_REQUEST';
export const CORE_INSTALL_ADMIN_SUCCESS = 'CORE_INSTALL_ADMIN_SUCCESS';
export const CORE_INSTALL_ADMIN_ERROR = 'CORE_INSTALL_ADMIN_ERROR';

export const CORE_UPDATE_DB_REQUEST = 'CORE_UPDATE_DB_REQUEST';
export const CORE_UPDATE_DB_SUCCESS = 'CORE_UPDATE_DB_SUCCESS';
export const CORE_UPDATE_DB_ERROR = 'CORE_UPDATE_DB_ERROR';

export const CORE_CREATE_DB_REQUEST = 'CORE_CREATE_DB_REQUEST';
export const CORE_CREATE_DB_SUCCESS = 'CORE_CREATE_DB_SUCCESS';
export const CORE_CREATE_DB_ERROR = 'CORE_CREATE_DB_ERROR';

import * as API from './api';

const info = debug('lumi:info:actions:core');
const error = debug('lumi:error:actions:core');

export function db_change(payload: any[]) {
    return { payload, type: CORE_DB_CHANGE };
}
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

export function update<T>(
    doc: T
): {
    types: string[];
    api: Promise<T>;
    payload: T[];
} {
    return {
        types: [
            CORE_UPDATE_DB_REQUEST,
            CORE_UPDATE_DB_SUCCESS,
            CORE_UPDATE_DB_ERROR
        ],
        api: API.update<T>(doc),
        payload: [doc]
    };
}

export function create<T>(
    doc: T
): {
    types: string[];
    api: Promise<T>;
    payload: T[];
} {
    return {
        types: [
            CORE_CREATE_DB_REQUEST,
            CORE_CREATE_DB_SUCCESS,
            CORE_CREATE_DB_ERROR
        ],
        api: API.create<T>(doc),
        payload: [doc]
    };
}

export function update_many<T>(
    docs: T[]
): {
    types: string[];
    api: Promise<T[]>;
    payload: T[];
} {
    return {
        types: [
            CORE_UPDATE_DB_REQUEST,
            CORE_UPDATE_DB_SUCCESS,
            CORE_UPDATE_DB_ERROR
        ],
        api: API.batch_create<T>(docs),
        payload: docs
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

export function install_admin(
    username: string,
    password: string,
    language: string
) {
    info('install_admin', username, language);

    return {
        types: [
            CORE_INSTALL_ADMIN_REQUEST,
            CORE_INSTALL_ADMIN_SUCCESS,
            CORE_INSTALL_ADMIN_ERROR
        ],
        api: API.install_admin(username, password, language),
        payload: { username, language }
    };
}

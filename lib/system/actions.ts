export const SYSTEM_SHUTDOWN = 'SYSTEM_SHUTDOWN';
export const SYSTEM_GET_SETTINGS_REQUEST = 'SYSTEM_GET_SETTINGS_REQUEST';
export const SYSTEM_GET_SETTINGS_SUCCESS = 'SYSTEM_GET_SETTINGS_SUCCESS';
export const SYSTEM_GET_SETTINGS_ERROR = 'SYSTEM_GET_SETTINGS_ERROR';

import * as api from './api';

export function shutdown() {
    return dispatch => {
        api.shutdown().then(res => {
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
        api: api.get_settings(),
        payload: {}
    };
}

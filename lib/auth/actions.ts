import * as debug from 'debug';

export const AUTH_GET_SESSION_REQUEST = 'AUTH_GET_SESSION_REQUEST';
export const AUTH_GET_SESSION_SUCCESS = 'AUTH_GET_SESSION_SUCCESS';
export const AUTH_GET_SESSION_ERROR = 'AUTH_GET_SESSION_ERROR';
export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_ERROR = 'AUTH_LOGIN_ERROR';
export const AUTH_REGISTER_REQUEST = 'AUTH_REGISTER_REQUEST';
export const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
export const AUTH_REGISTER_ERROR = 'AUTH_REGISTER_ERROR';
export const AUTH_LOGOUT_REQUEST = 'AUTH_LOGOUT_REQUEST';
export const AUTH_LOGOUT_SUCCESS = 'AUTH_LOGOUT_SUCCESS';
export const AUTH_LOGOUT_ERROR = 'AUTH_LOGOUT_ERROR';
export const AUTH_LOGIN_CHECK_USERNAME_REQUEST =
    'AUTH_LOGIN_CHECK_USERNAME_REQUEST';
export const AUTH_LOGIN_CHECK_USERNAME_SUCCESS =
    'AUTH_LOGIN_CHECK_USERNAME_SUCCESS';
export const AUTH_LOGIN_CHECK_USERNAME_ERROR =
    'AUTH_LOGIN_CHECK_USERNAME_ERROR';
export const AUTH_LOGIN_SET_PASSWORD_REQUEST =
    'AUTH_LOGIN_SET_PASSWORD_REQUEST';
export const AUTH_LOGIN_SET_PASSWORD_SUCCESS =
    'AUTH_LOGIN_SET_PASSWORD_SUCCESS';
export const AUTH_LOGIN_SET_PASSWORD_ERROR = 'AUTH_LOGIN_SET_PASSWORD_ERROR';
export const AUTH_CHECK_USERNAME_REQUEST = 'AUTH_CHECK_USERNAME_REQUEST';
export const AUTH_CHECK_USERNAME_SUCCESS = 'AUTH_CHECK_USERNAME_SUCCESS';
export const AUTH_CHECK_USERNAME_ERROR = 'AUTH_CHECK_USERNAME_ERROR';

export const AUTH_SET_USERNAME = 'AUTH_SET_USERNAME';
export const AUTH_RESET_ERROR = 'AUTH_RESET_ERROR';
export const AUTH_SET_EMAIL = 'AUTH_SET_EMAIL';
export const AUTH_SET_PASSWORD = 'AUTH_SET_PASSWORD';

const log_info = debug('lumi:info:auth:actions');
const log_error = debug('lumi:error:auth:actions');

import * as API from './api';

export function login(username: string, password: string) {
    log_info('login', 'start');
    return dispatch => {
        dispatch({
            type: AUTH_LOGIN_REQUEST,
            payload: { username }
        });

        API.login(username, password)
            .then(response => {
                log_info('login', 'success', response.body);
                window.localStorage.jwt_token = response.body.jwt_token;
                window.localStorage.user_id = response.body._id;
                window.localStorage.level = response.body.level;
                dispatch({ type: AUTH_LOGIN_SUCCESS, payload: response.body });
            })
            .catch(error => {
                log_error('login', 'error', error);
                dispatch({
                    type: AUTH_LOGIN_ERROR,
                    payload: error.response.body
                });
            });
    };
}

export function logout() {
    window.localStorage.clear();
    return {
        types: [AUTH_LOGOUT_REQUEST, AUTH_LOGOUT_SUCCESS, AUTH_LOGOUT_ERROR],
        api: API.logout(),
        payload: {}
    };
}

export function register<T>(payload: T) {
    return {
        payload,
        types: [
            AUTH_REGISTER_REQUEST,
            AUTH_REGISTER_SUCCESS,
            AUTH_REGISTER_ERROR
        ],
        api: API.register<T>(payload)
    };
}

export function check_username(username: string) {
    return {
        types: [
            AUTH_CHECK_USERNAME_REQUEST,
            AUTH_CHECK_USERNAME_SUCCESS,
            AUTH_CHECK_USERNAME_ERROR
        ],
        api: API.check_username(username),
        payload: { username }
    };
}

export function set_username(username: string) {
    return {
        type: AUTH_SET_USERNAME,
        payload: username
    };
}

export function reset_error() {
    return { type: AUTH_RESET_ERROR };
}

export function set_email(email: string) {
    return {
        type: AUTH_SET_EMAIL,
        payload: email
    };
}

export function set_password(password: string) {
    return {
        type: AUTH_SET_PASSWORD,
        payload: password
    };
}

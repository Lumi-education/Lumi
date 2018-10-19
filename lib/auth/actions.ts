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

import * as API from './api';

export function login(username: string, password: string) {
    return {
        types: [AUTH_LOGIN_REQUEST, AUTH_LOGIN_SUCCESS, AUTH_LOGIN_ERROR],
        api: API.login(username, password),
        payload: { username }
    };
}

export function logout() {
    return {
        types: [AUTH_LOGOUT_REQUEST, AUTH_LOGOUT_SUCCESS, AUTH_LOGOUT_ERROR],
        api: API.logout(),
        payload: {}
    };
}

export function register(username: string, password?: string) {
    return {
        types: [
            AUTH_REGISTER_REQUEST,
            AUTH_REGISTER_SUCCESS,
            AUTH_REGISTER_ERROR
        ],
        api: API.register(username, password),
        payload: { username }
    };
}

export function get_session() {
    return {
        types: [
            AUTH_GET_SESSION_REQUEST,
            AUTH_GET_SESSION_SUCCESS,
            AUTH_GET_SESSION_ERROR
        ],
        api: API.get_session(),
        payload: {}
    };
}

export function set_password(username: string, password: string) {
    return {
        types: [
            AUTH_LOGIN_SET_PASSWORD_REQUEST,
            AUTH_LOGIN_SET_PASSWORD_SUCCESS,
            AUTH_LOGIN_SET_PASSWORD_ERROR
        ],
        api: API.set_password(username, password),
        payload: { username }
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

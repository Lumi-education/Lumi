import * as shortid from 'shortid';

declare var window;

import * as API from './api';

import * as k from './constants';

import {
    AUTH_GET_SESSION_REQUEST,
    AUTH_GET_SESSION_SUCCESS,
    AUTH_GET_SESSION_ERROR,
    AUTH_LOGIN_REQUEST,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_ERROR,
    AUTH_LOGOUT_REQUEST,
    AUTH_LOGOUT_SUCCESS,
    AUTH_LOGOUT_ERROR,
    AUTH_REGISTER_REQUEST,
    AUTH_REGISTER_SUCCESS,
    AUTH_REGISTER_ERROR
} from '../action-types';

export function login(
    username: string,
    password: string,
    id: string = shortid()
) {
    return dispatch => {
        dispatch({ id, type: AUTH_LOGIN_REQUEST, payload: { username } });

        return API.login(username, password)
            .then(res => {
                switch (res.status) {
                    case 200:
                        window.localStorage.jwt_token = res.body.jwt_token;
                        dispatch({
                            id,
                            type: AUTH_LOGIN_SUCCESS,
                            payload: res.body
                        });
                        dispatch(get_session());
                        break;

                    case 404:
                    default:
                        dispatch({ id, type: AUTH_LOGIN_ERROR, payload: res });
                }
            })
            .catch(err => {
                dispatch({ id, type: AUTH_LOGIN_ERROR, payload: err });
            });
    };
}

export function logout(id = shortid()) {
    return {
        types: [AUTH_LOGOUT_REQUEST, AUTH_LOGOUT_SUCCESS, AUTH_LOGOUT_ERROR],
        api: API.logout(),
        payload: { id }
    };
}

export function register(username: string, password: string) {
    return dispatch => {
        dispatch({ type: AUTH_REGISTER_REQUEST, payload: { username } });

        API.register(username, password)
            .then(res => {
                switch (res.status) {
                    case 201:
                    case 200:
                        dispatch({
                            type: AUTH_REGISTER_SUCCESS,
                            payload: { username, response: res }
                        });
                        dispatch(login(username, password));
                        break;
                    default:
                        break;
                }
            })
            .catch(err => {
                dispatch({
                    type: AUTH_REGISTER_ERROR,
                    payload: { username, response: err }
                });
            });
    };
}

export function get_session(id = shortid()) {
    return {
        types: [
            AUTH_GET_SESSION_REQUEST,
            AUTH_GET_SESSION_SUCCESS,
            AUTH_GET_SESSION_ERROR
        ],
        api: API.get_session(),
        payload: { id }
    };
}

export function check_username(username: string) {
    return {
        types: [
            k.AUTH_LOGIN_CHECK_USERNAME_REQUEST,
            k.AUTH_LOGIN_CHECK_USERNAME_SUCCESS,
            k.AUTH_LOGIN_CHECK_USERNAME_ERROR
        ],
        api: API.check_username(username),
        payload: { username }
    };
}

export function set_password(username: string, password: string) {
    return {
        types: [
            k.AUTH_LOGIN_SET_PASSWORD_REQUEST,
            k.AUTH_LOGIN_SET_PASSWORD_SUCCESS,
            k.AUTH_LOGIN_SET_PASSWORD_ERROR
        ],
        api: API.set_password(username, password),
        payload: { username }
    };
}

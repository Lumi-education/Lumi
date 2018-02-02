import * as shortid from 'shortid';

declare var window;

import * as API from './api';

import * as k from './constants';

export function login(
    username: string,
    password: string,
    id: string = shortid()
) {
    return dispatch => {
        dispatch({ id, type: k.AUTH_LOGIN_REQUEST, payload: { username } });

        return API.login(username, password)
            .then(res => {
                switch (res.status) {
                    case 200:
                        window.localStorage.jwt_token = res.body.jwt_token;
                        dispatch({
                            id,
                            type: k.AUTH_LOGIN_SUCCESS,
                            payload: res.body
                        });
                        dispatch(get_session());
                        break;

                    case 404:
                    default:
                        dispatch({
                            id,
                            type: k.AUTH_LOGIN_ERROR,
                            payload: res
                        });
                }
            })
            .catch(err => {
                dispatch({ id, type: k.AUTH_LOGIN_ERROR, payload: err });
            });
    };
}

export function logout(id = shortid()) {
    return {
        types: [
            k.AUTH_LOGOUT_REQUEST,
            k.AUTH_LOGOUT_SUCCESS,
            k.AUTH_LOGOUT_ERROR
        ],
        api: API.logout(),
        payload: { id }
    };
}

export function register(username: string, password: string) {
    return dispatch => {
        dispatch({ type: k.AUTH_REGISTER_REQUEST, payload: { username } });

        API.register(username, password)
            .then(res => {
                switch (res.status) {
                    case 201:
                    case 200:
                        dispatch({
                            type: k.AUTH_REGISTER_SUCCESS,
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
                    type: k.AUTH_REGISTER_ERROR,
                    payload: { username, response: err }
                });
            });
    };
}

export function get_session(id = shortid()) {
    return {
        types: [
            k.AUTH_GET_SESSION_REQUEST,
            k.AUTH_GET_SESSION_SUCCESS,
            k.AUTH_GET_SESSION_ERROR
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
        // api: API.check_username(username),
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

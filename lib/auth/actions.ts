declare var window;

import * as API from './api';

import * as k from './constants';

export function login(username: string, password: string) {
    return {
        types: [k.AUTH_LOGIN_REQUEST, k.AUTH_LOGIN_SUCCESS, k.AUTH_LOGIN_ERROR],
        api: API.login(username, password),
        payload: { username }
    };
}

export function logout() {
    return {
        types: [
            k.AUTH_LOGOUT_REQUEST,
            k.AUTH_LOGOUT_SUCCESS,
            k.AUTH_LOGOUT_ERROR
        ],
        api: API.logout(),
        payload: {}
    };
}

export function register(username: string, password: string) {
    return {
        types: [
            k.AUTH_REGISTER_REQUEST,
            k.AUTH_REGISTER_SUCCESS,
            k.AUTH_REGISTER_ERROR
        ],
        api: API.register(username, password),
        payload: { username }
    };

    // return dispatch => {
    //     dispatch({ type: k.AUTH_REGISTER_REQUEST, payload: { username } });

    //     API.register(username, password)
    //         .then(res => {
    //             switch (res.status) {
    //                 case 201:
    //                 case 200:
    //                     dispatch({
    //                         type: k.AUTH_REGISTER_SUCCESS,
    //                         payload: { username, response: res }
    //                     });
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         })
    //         .catch(err => {
    //             dispatch({
    //                 type: k.AUTH_REGISTER_ERROR,
    //                 payload: { username, response: err }
    //             });
    //         });
    // };
}

export function get_session() {
    return {
        types: [
            k.AUTH_GET_SESSION_REQUEST,
            k.AUTH_GET_SESSION_SUCCESS,
            k.AUTH_GET_SESSION_ERROR
        ],
        api: API.get_session(),
        payload: {}
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

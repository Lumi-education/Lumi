import * as shortid from 'shortid';

declare var window;

import * as API from './api';

import {
    AUTH_GET_SESSION_REQUEST,
    AUTH_GET_SESSION_SUCCESS,
    AUTH_GET_SESSION_ERROR,
    AUTH_LOGIN_REQUEST,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_ERROR,
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

        API.login(username, password)
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

export function register(username: string, password: string) {
    return dispatch => {
        dispatch({ type: AUTH_REGISTER_REQUEST, payload: { username } });

        API.register(username, password)
            // .db_put('/_users/org.couchdb.user:'+username,
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

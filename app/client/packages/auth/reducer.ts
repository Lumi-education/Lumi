import { assign, unionBy } from 'lodash';

import { IAuth } from './types';

import * as k from './constants';

import {
    AUTH_GET_SESSION_SUCCESS,
    AUTH_LOGIN_ERROR,
    AUTH_LOGIN_SUCCESS,
    AUTH_REGISTER_ERROR,
    AUTH_LOGOUT_SUCCESS,
    AUTH_LOGIN_REQUEST
} from '../action-types';

const initialState: IAuth = {
    is_authed: false,
    response: 0,
    userlevel: 0,
    user_id: '',
    is_required: true,
    username: '',
    username_request: 'init',
    login_request: 'init',
    username_pw_is_set: false
};

export default function(state: IAuth = initialState, action): IAuth {
    switch (action.type) {
        case AUTH_LOGIN_REQUEST:
            return assign({}, state, { login_request: 'pending' });

        case AUTH_LOGIN_SUCCESS:
            return assign({}, state, { login_request: 'success' });

        case AUTH_GET_SESSION_SUCCESS:
            return assign({}, state, {
                is_authed: true,
                userlevel: action.payload.level,
                user_id: action.payload._id
            });

        case AUTH_LOGIN_ERROR:
        case AUTH_REGISTER_ERROR:
            return assign({}, state, { login_request: 'error' });

        case AUTH_LOGOUT_SUCCESS:
            window.localStorage.clear();
            return initialState;

        case k.AUTH_LOGIN_CHECK_USERNAME_REQUEST:
            return assign({}, state, {
                username: action.username,
                username_request: 'pending',
                username_pw_is_set: false
            });

        case k.AUTH_LOGIN_CHECK_USERNAME_SUCCESS:
            return assign({}, state, {
                username: action.payload.username,
                username_request: 'success',
                username_pw_is_set: action.payload.password
            });

        case k.AUTH_LOGIN_CHECK_USERNAME_ERROR:
            return assign({}, state, { username_request: 'error' });

        case '@@INIT':
            return initialState;

        default:
            return state;
    }
}

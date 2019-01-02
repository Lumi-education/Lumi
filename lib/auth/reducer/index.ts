import { assign } from 'lodash';

import { IAuth } from '../types';

import * as k from '../actions';

declare var window;

const initialState: IAuth = {
    userlevel: window.localStorage.level,
    user_id: window.localStorage.user_id,
    username: '',
    username_validated: false,
    email: {
        email: '',
        validated: false
    },
    login_state: 'init',
    error_message: null
};

export default function(state: IAuth = initialState, action): IAuth {
    switch (action.type) {
        case k.AUTH_GET_SESSION_SUCCESS:
            return assign({}, state, {
                userlevel: action.payload.level,
                user_id: action.payload._id,
                username: action.payload.name,
                password: action.payload.password
            });

        case k.AUTH_CHECK_USERNAME_SUCCESS:
            return assign({}, state, {
                username_validated: action.payload.ok,
                error_message: action.payload.ok ? null : 'auth.username_exists'
            });

        case k.AUTH_LOGIN_SET_PASSWORD_SUCCESS:
            return assign({}, state, { password: true });

        case k.AUTH_LOGIN_SUCCESS:
            return assign({}, state, {
                login_state: 'success',
                user_id: action.payload._id,
                userlevel: action.payload.level
            });

        case k.AUTH_LOGIN_REQUEST:
            return assign({}, state, { login_state: 'pending' });

        case k.AUTH_SET_EMAIL:
            return assign({}, state, {
                email: {
                    email: action.payload,
                    validated: action.payload.match(
                        /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
                    )
                }
            });

        case k.AUTH_LOGIN_ERROR:
            return assign({}, state, {
                login_state: 'error',
                error_message: action.payload.message
            });

        case k.AUTH_RESET_ERROR:
            return assign({}, state, {
                login_state: 'init',
                error_message: null
            });

        case k.AUTH_LOGOUT_SUCCESS:
            window.logout = true;
            window.localStorage.clear();
            return initialState;

        case k.AUTH_SET_USERNAME:
            return assign({}, state, {
                username: action.payload.replace(/[^a-z0-9]/gi, ''),
                login_state: 'init',
                error_message: null
            });

        case '@@INIT':
            return initialState;

        default:
            return state;
    }
}

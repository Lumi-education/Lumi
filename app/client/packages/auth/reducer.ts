import { assign, unionBy } from 'lodash';

import {
    AUTH_GET_SESSION_SUCCESS,
    AUTH_LOGIN_ERROR,
    AUTH_LOGIN_SUCCESS,
    AUTH_REGISTER_ERROR,
    AUTH_LOGOUT_SUCCESS
} from '../action-types';

const initialState: {} = {
    is_authed: false,
    response: 0,
    userlevel: 0
};

export default function(state: {} = initialState, action): {} {
    switch (action.type) {
        case AUTH_GET_SESSION_SUCCESS:
            return assign({}, state, {
                is_authed: true,
                userlevel: action.payload.level
            });

        case AUTH_LOGIN_ERROR:
        case AUTH_REGISTER_ERROR:
            return assign({}, state, { response: action.payload.status });

        case AUTH_LOGOUT_SUCCESS:
            window.localStorage.clear();
            return initialState;

        case '@@INIT':
            return initialState;

        default:
            return state;
    }
}

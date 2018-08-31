import { assign, unionBy } from 'lodash';

import { IAuth } from '../types';

import * as k from '../actions';

declare var window;

const initialState: IAuth = {
    userlevel: 0,
    user_id: undefined,
    username: undefined,
    password: undefined
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

        case k.AUTH_LOGIN_SET_PASSWORD_SUCCESS:
            return assign({}, state, { password: true });

        case k.AUTH_LOGOUT_SUCCESS:
            window.logout = true;
            window.localStorage.clear();
            return initialState;

        case '@@INIT':
            return initialState;

        default:
            return state;
    }
}

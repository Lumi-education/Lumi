import { assign, unionBy } from 'lodash';

import { IUser } from '../types';

import { AUTH_GET_SESSION_SUCCESS } from 'lib/auth/constants';

const initialState: IUser = {
    _id: undefined,
    type: 'user',
    name: 'error',
    level: 0,
    groups: [],
    last_login: undefined,
    last_active: undefined,
    online: false,
    location: '',
    password: undefined
};
export default function(state: IUser = initialState, action): IUser {
    switch (action.type) {
        case AUTH_GET_SESSION_SUCCESS:
            return assign({}, state, action.payload);

        default:
            return state;
    }
}

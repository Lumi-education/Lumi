import { IUser } from '../types';

import { AUTH_GET_SESSION_SUCCESS } from '../../auth/constants';

const initialState: IUser = {
    _id: undefined,
    type: 'user',
    name: undefined,
    level: 0,
    groups: [],
    last_login: undefined,
    last_active: undefined,
    online: false,
    location: '',
    password: '',
    flow: []
};

export default function(state: IUser = initialState, action): IUser {
    switch (action.type) {
        case AUTH_GET_SESSION_SUCCESS:
            return action.payload;

        case 'DB_CHANGE':
            if (action.payload._id === state._id) {
                return action.payload;
            }

        default:
            return state;
    }
}

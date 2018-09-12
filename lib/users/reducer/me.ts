import { IUser } from '../types';

import { AUTH_GET_SESSION_SUCCESS } from '../../auth/actions';

import * as Flow from 'lib/flow';

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
    flow: [],
    _deleted: false
};

export default function(state: IUser = initialState, action): IUser {
    switch (action.type) {
        case AUTH_GET_SESSION_SUCCESS:
            return action.payload;

        case 'DB_CHANGE':
            if (action.payload._id === state._id) {
                return action.payload;
            }

        case Flow.actions.FLOW_ARCHIVE_ASSIGNMENT_SUCCESS:
            const user = action.payload.filter(doc => doc._id === state._id)[0];
            return user || state;

        default:
            return state;
    }
}

import { IUser } from '../types';

import { AUTH_GET_SESSION_SUCCESS } from '../../auth/actions';

import * as Core from 'lib/core';

const initialState: IUser = {
    _id: undefined,
    _rev: undefined,
    type: 'user',
    name: undefined,
    level: 0,
    groups: [],
    password: '',
    flow: [],
    _deleted: false,
    _attachments: {}
};

export default function(state: IUser = initialState, action): IUser {
    switch (action.type) {
        case AUTH_GET_SESSION_SUCCESS:
            return action.payload;

        case Core.actions.CORE_DB_CHANGE:
            if (action.payload._id === state._id) {
                return action.payload;
            }

        default:
            return state;
    }
}

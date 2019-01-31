import { IUser } from '../types';
import * as Core from 'lib/core';

import { AUTH_GET_SESSION_SUCCESS } from '../../auth/actions';

import * as DB from 'lib/db';

const initialState: IUser = {
    _id: localStorage.user_id,
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
    try {
        switch (action.type) {
            case AUTH_GET_SESSION_SUCCESS:
                return action.payload;

            case DB.actions.DB_CHANGE:
                const user = action.payload.filter(
                    doc => doc._id === state._id
                )[0];
                if (user) {
                    return user;
                }

            default:
                return state;
        }
    } catch (error) {
        Core.raven.captureException(error);
        return state;
    }
}

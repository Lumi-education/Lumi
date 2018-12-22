import { unionBy } from 'lodash';

import { IUser } from '../types';

import { USERS_CREATE_USER_SUCCESS } from '../actions';

import * as Core from 'lib/core';

export default function(state: IUser[] = [], action): IUser[] {
    switch (action.type) {
        case USERS_CREATE_USER_SUCCESS:
            return [...state, ...action.payload];

        case Core.actions.CORE_DB_CHANGE:
            return unionBy(
                action.payload.filter(d => d.type === 'user'),
                state,
                '_id'
            ).filter(user => !user._deleted);

        default:
            return state;
    }
}

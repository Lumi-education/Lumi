import { unionBy } from 'lodash';
import * as Core from 'lib/core';
import { IUser } from '../types';

import { USERS_CREATE_USER_SUCCESS } from '../actions';

import * as DB from 'lib/db';

export default function(state: IUser[] = [], action): IUser[] {
    try {
        switch (action.type) {
            case USERS_CREATE_USER_SUCCESS:
                return [...state, ...action.payload];

            case DB.actions.DB_CHANGE:
                return unionBy(
                    action.payload.filter(d => d.type === 'user'),
                    state,
                    '_id'
                ).filter(user => !user._deleted);

            default:
                return state;
        }
    } catch (error) {
        Core.raven.captureException(error);
        return state;
    }
}

import { Map } from 'immutable';
import { IData } from 'lib/cards/types';

import { arrayToObject } from 'lib/core/utils';

import {
    DATA_GET_SUCCESS,
    DATA_UPDATE_SUCCESS,
    DATA_UPDATE_REQUEST,
    DATA_CREATE_SUCCESS,
    DATA_CREATE_REQUEST
} from '../constants';

import { DATA_GET_CARD_DATA_SUCCESS } from '../actions';

export default function(
    state: Map<string, {}> = Map<string, IData>({}),
    action
): Map<string, {}> {
    switch (action.type) {
        case DATA_UPDATE_SUCCESS:
        case DATA_CREATE_SUCCESS:
            const o = {};
            o[action.payload._id] = action.payload;
            return state.merge(Map<string, {}>(o));

        case 'DB_CHANGE':
        case DATA_GET_SUCCESS:
        case DATA_GET_CARD_DATA_SUCCESS:
        case 'USERS_INIT_USER_SUCCESS':
            return state.merge(
                Map<string, {}>(
                    arrayToObject(action.payload.filter(d => d.type === 'data'))
                )
            );

        case DATA_UPDATE_REQUEST:
            return state.update(action.data._id, data => {
                return action.data;
            });

        default:
            return state;
    }
}

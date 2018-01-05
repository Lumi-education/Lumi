import { Map } from 'immutable';
import { IData } from 'lib/cards/types';

import { arrayToObject } from 'client/utils';

import {
    DATA_GET_SUCCESS,
    DATA_UPDATE_SUCCESS,
    DATA_UPDATE_REQUEST,
    DATA_CREATE_SUCCESS,
    DB_CHANGE,
    DATA_CREATE_REQUEST
} from 'lib/action-types';

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

        case DB_CHANGE:
        case DATA_GET_SUCCESS:
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

import { Map } from 'immutable';
import { IData } from 'common/types';

import { arrayToObject } from 'client/utils';

import {
    DATA_GET_SUCCESS,
    DATA_UPDATE_SUCCESS,
    DATA_CREATE_SUCCESS,
    DB_CHANGE
} from 'client/state/action-types';

export default function(
    state: Map<string, {}> = Map<string, IData>({}),
    action
): Map<string, {}> {
    switch (action.type) {
        case DATA_GET_SUCCESS:
            return state.merge(
                Map<string, {}>(arrayToObject(action.payload.data))
            );

        case DATA_UPDATE_SUCCESS:
        case DATA_CREATE_SUCCESS:
            let o = {};
            o[action.payload._id] = action.payload;
            return state.merge(Map<string, {}>(o));

        case DB_CHANGE:
            return state.merge(
                Map<string, {}>(
                    arrayToObject(action.payload.filter(d => d.type === 'data'))
                )
            );

        default:
            return state;
    }
}

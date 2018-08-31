import { assign } from 'lodash';

import { IStatus } from '../types';

import { CORE_PING_ERROR, CORE_PING_SUCCESS } from '../actions';

const initialState: IStatus = {
    connected: true
};

export default function(state: IStatus = initialState, action): IStatus {
    switch (action.type) {
        case CORE_PING_ERROR:
            return assign({}, state, { connected: false });

        case CORE_PING_SUCCESS:
            return assign({}, state, { connected: true });

        default:
            return state;
    }
}

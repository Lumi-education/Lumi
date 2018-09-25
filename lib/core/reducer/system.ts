import { assign } from 'lodash';

import { ISystemSettings } from '../types';

import {
    SYSTEM_GET_SETTINGS_SUCCESS,
    CORE_GET_ENV_SUCCESS,
    CORE_CHECK_UPDATE_SUCCESS,
    CORE_CHECK_UPDATE_REQUEST,
    CORE_CHECK_UPDATE_ERROR
} from '../actions';

const initialState: ISystemSettings = {
    _id: 'system',
    changes_port: 3001,
    env: {},
    update: {
        tag_name: 'v0.0.0',
        name: '',
        body: '',
        request_status: 'init'
    }
};

export default function(
    state: ISystemSettings = initialState,
    action
): ISystemSettings {
    switch (action.type) {
        case SYSTEM_GET_SETTINGS_SUCCESS:
            return action.payload;

        case CORE_CHECK_UPDATE_REQUEST:
            return assign({}, state, {
                update: assign({}, state.update, { request_status: 'pending' })
            });

        case CORE_CHECK_UPDATE_ERROR:
            return assign({}, state, {
                update: assign({}, state.update, { request_status: 'error' })
            });

        case CORE_CHECK_UPDATE_SUCCESS:
            return assign({}, state, {
                update: assign({}, action.payload, {
                    request_status: 'success'
                })
            });

        case CORE_GET_ENV_SUCCESS:
            return assign({}, state, { env: action.payload });

        default:
            return state;
    }
}

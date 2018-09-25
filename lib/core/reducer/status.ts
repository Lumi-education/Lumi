import { assign } from 'lodash';

import { IStatus } from '../types';

import {
    CORE_PING_ERROR,
    CORE_PING_SUCCESS,
    CORE_UPDATE_ENV_SUCCESS,
    CORE_UPDATE_SYSTEM_SUCCESS,
    SYSTEM_SHUTDOWN
} from '../actions';

const initialState: IStatus = {
    connected: true,
    status_page: false,
    status_page_text: ''
};

export default function(state: IStatus = initialState, action): IStatus {
    switch (action.type) {
        case CORE_PING_ERROR:
            return assign({}, state, { connected: false });

        case CORE_UPDATE_ENV_SUCCESS:
        case CORE_UPDATE_SYSTEM_SUCCESS:
            return assign({}, state, {
                status_page: true,
                status_page_text:
                    'System wird aktualisiert. Dies kann einige Minuten dauern. Bitte warten.'
            });
        case SYSTEM_SHUTDOWN:
            return assign({}, state, {
                status_page: true,
                status_page_text:
                    'System wird heruntergefahren. Bitte 20 Sekunden warten.'
            });

        case CORE_PING_SUCCESS:
            return assign({}, state, { connected: true });

        default:
            return state;
    }
}

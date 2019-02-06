import { assign } from 'lodash';
import raven from '../raven';

import { IStatus } from '../types';

import {
    CORE_UPDATE_ENV_SUCCESS,
    CORE_UPDATE_SYSTEM_SUCCESS,
    SYSTEM_SHUTDOWN,
    CORE_GET_ENV_SUCCESS,
    CORE_CHECK_UPDATE_SUCCESS,
    CORE_CHECK_UPDATE_REQUEST,
    CORE_CHECK_UPDATE_ERROR
} from '../actions';

const initialState: IStatus = {
    connected: true,
    status_page: false,
    status_page_text: '',
    env: {},
    update: {
        tag_name: 'v0.0.0',
        name: '',
        body: '',
        request_status: 'init'
    }
};

export default function(state: IStatus = initialState, action): IStatus {
    try {
        switch (action.type) {
            // case CORE_CHECK_UPDATE_REQUEST:
            //     return assign({}, state, {
            //         update: assign({}, state.update, {
            //             request_status: 'pending'
            //         })
            //     });

            // case CORE_CHECK_UPDATE_ERROR:
            //     return assign({}, state, {
            //         update: assign({}, state.update, {
            //             request_status: 'error'
            //         })
            //     });

            // case CORE_CHECK_UPDATE_SUCCESS:
            //     return assign({}, state, {
            //         update: assign({}, action.payload, {
            //             request_status: 'success'
            //         })
            //     });

            // case CORE_GET_ENV_SUCCESS:
            //     return assign({}, state, { env: action.payload });

            // case CORE_UPDATE_ENV_SUCCESS:
            // case CORE_UPDATE_SYSTEM_SUCCESS:
            //     return assign({}, state, {
            //         status_page: true,
            //         status_page_text:
            //             'System wird aktualisiert. Dies kann einige Minuten dauern. Bitte warten.'
            //     });

            // case SYSTEM_SHUTDOWN:
            //     return assign({}, state, {
            //         status_page: true,
            //         status_page_text:
            //             'System wird heruntergefahren. Bitte 20 Sekunden warten.'
            //     });

            default:
                return state;
        }
    } catch (error) {
        raven.captureException(error);
        return state;
    }
}

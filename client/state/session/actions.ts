import { assign } from 'lodash';

import { SESSION_GET_SESSION_ID_SUCCESS } from '../action-types';

import * as API from './api';

export function session_update(update) {
    return dispatch => {
        API.session_update(update)
            .then(res => {
                switch (res.status) {
                    case 200:
                        break;
                    default:
                }
            })
            .catch();
    };
}
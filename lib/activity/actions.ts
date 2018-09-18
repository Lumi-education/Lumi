export const ACTIVITY_GET_REQUEST = 'ACTIVITY_GET_REQUEST';
export const ACTIVITY_GET_SUCCESS = ' ACTIVITY_GET_SUCCESS';
export const ACTIVITY_GET_ERROR = ' ACTIVITY_GET_ERROR';

import * as API from './api';

export function get_activities() {
    return {
        types: [ACTIVITY_GET_REQUEST, ACTIVITY_GET_SUCCESS, ACTIVITY_GET_ERROR],
        api: API.get_activites(),
        payload: {}
    };
}

export const GRADES_GET_USER_GRADES_REQUEST = 'GRADES_GET_USER_GRADES_REQUEST';
export const GRADES_GET_USER_GRADES_SUCCESS = 'GRADES_GET_USER_GRADES_SUCCESS';
export const GRADES_GET_USER_GRADES_ERROR = 'GRADES_GET_USER_GRADES_ERROR';

import * as API from './api';

export function get_user_grades(user_id: string) {
    return {
        types: [
            GRADES_GET_USER_GRADES_REQUEST,
            GRADES_GET_USER_GRADES_SUCCESS,
            GRADES_GET_USER_GRADES_ERROR
        ],
        api: API.get_user_grades(user_id),
        payload: { payload: { user_id } }
    };
}

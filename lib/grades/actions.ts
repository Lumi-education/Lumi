export const GRADES_GET_USER_GRADES_REQUEST = 'GRADES_GET_USER_GRADES_REQUEST';
export const GRADES_GET_USER_GRADES_SUCCESS = 'GRADES_GET_USER_GRADES_SUCCESS';
export const GRADES_GET_USER_GRADES_ERROR = 'GRADES_GET_USER_GRADES_ERROR';
export const GRADES_CREATE_GRADE_REQUEST = ' GRADES_CREATE_GRADE_REQUEST';
export const GRADES_CREATE_GRADE_SUCCESS = 'GRADES_CREATE_GRADE_SUCCESS';
export const GRADES_CREATE_GRADE_ERROR = 'GRADES_CREATE_GRADE_ERROR';

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

export function create_grade(
    user_id: string,
    grade_type: string,
    score: number,
    note?: string,
    ref_id?: string
) {
    return {
        types: [
            GRADES_CREATE_GRADE_REQUEST,
            GRADES_CREATE_GRADE_SUCCESS,
            GRADES_CREATE_GRADE_ERROR
        ],
        api: API.create_grade(user_id, grade_type, score, note, ref_id),
        payload: { payload: { user_id, grade_type, score, note, ref_id } }
    };
}

export const GRADES_GET_USER_GRADES_REQUEST = 'GRADES_GET_USER_GRADES_REQUEST';
export const GRADES_GET_USER_GRADES_SUCCESS = 'GRADES_GET_USER_GRADES_SUCCESS';
export const GRADES_GET_USER_GRADES_ERROR = 'GRADES_GET_USER_GRADES_ERROR';
export const GRADES_CREATE_GRADE_REQUEST = ' GRADES_CREATE_GRADE_REQUEST';
export const GRADES_CREATE_GRADE_SUCCESS = 'GRADES_CREATE_GRADE_SUCCESS';
export const GRADES_CREATE_GRADE_ERROR = 'GRADES_CREATE_GRADE_ERROR';
export const GRADES_DELETE_GRADE_REQUEST = 'GRADES_DELETE_GRADE_REQUEST';
export const GRADES_DELETE_GRADE_SUCCESS = 'GRADES_DELETE_GRADE_SUCCESS';
export const GRADES_DELETE_GRADE_ERROR = 'GRADES_DELETE_GRADE_ERROR';
export const GRADES_UPDATE_GRADE_REQUEST = 'GRADES_UPDATE_GRADE_REQUEST';
export const GRADES_UPDATE_GRADE_SUCCESS = 'GRADES_UPDATE_GRADE_SUCCESS';
export const GRADES_UPDATE_GRADE_ERROR = 'GRADES_UPDATE_GRADE_ERROR';

export const GRADES_SHOW_CREATE_GRADE_DIALOG =
    'GRADES_SHOW_CREATE_GRADE_DIALOG';
export const GRADES_HIDE_CREATE_GRADE_DIALOG =
    'GRADES_HIDE_CREATE_GRADE_DIALOG';
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

export function update_grade(grade_id: string, update) {
    return {
        types: [
            GRADES_UPDATE_GRADE_REQUEST,
            GRADES_UPDATE_GRADE_SUCCESS,
            GRADES_UPDATE_GRADE_ERROR
        ],
        api: API.update_grade(grade_id, update),
        payload: { payload: { grade_id, update } }
    };
}

export function show_create_grade_dialog(user_id: string, grade_id?: string) {
    return {
        user_id,
        grade_id,
        type: GRADES_SHOW_CREATE_GRADE_DIALOG
    };
}

export function hide_create_grade_dialog() {
    return {
        type: GRADES_HIDE_CREATE_GRADE_DIALOG
    };
}

export function delete_grade(grade_id: string) {
    return {
        types: [
            GRADES_DELETE_GRADE_REQUEST,
            GRADES_DELETE_GRADE_SUCCESS,
            GRADES_DELETE_GRADE_ERROR
        ],
        api: API.delete_grade(grade_id),
        payload: { payload: { grade_id } }
    };
}

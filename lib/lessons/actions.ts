export const LESSONS_CREATE_LESSON_REQUEST = 'LESSONS_CREATE_LESSON_REQUEST';
export const LESSONS_CREATE_LESSON_SUCCESS = 'LESSONS_CREATE_LESSON_SUCCESS';
export const LESSONS_CREATE_LESSON_ERROR = 'LESSONS_CREATE_LESSON_ERROR';

export const LESSONS_GET_LESSONS_REQUEST = 'LESSONS_GET_LESSONS_REQUEST';
export const LESSONS_GET_LESSONS_SUCCESS = 'LESSONS_GET_LESSONS_SUCCESS';
export const LESSONS_GET_LESSONS_ERROR = 'LESSONS_GET_LESSONS_ERROR';

import * as API from './api';

export function create_lesson(name: string, cards: string[]) {
    return {
        types: [
            LESSONS_CREATE_LESSON_REQUEST,
            LESSONS_CREATE_LESSON_SUCCESS,
            LESSONS_CREATE_LESSON_ERROR
        ],
        api: API.create_lesson(name, cards),
        payload: { payload: { name, cards } }
    };
}

export function get_lessons() {
    return {
        types: [
            LESSONS_GET_LESSONS_REQUEST,
            LESSONS_GET_LESSONS_SUCCESS,
            LESSONS_GET_LESSONS_ERROR
        ],
        api: API.get_lessons(),
        payload: {}
    };
}

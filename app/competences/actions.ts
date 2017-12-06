import * as shortid from 'shortid';

export const COMPETENCES_CREATE_COMPETENCE_REQUEST =
    'COMPETENCES_CREATE_COMPETENCE_REQUEST';
export const COMPETENCES_CREATE_COMPETENCE_SUCCESS =
    'COMPETENCES_CREATE_COMPETENCE_SUCCESS';
export const COMPETENCES_CREATE_COMPETENCE_ERROR =
    'COMPETENCES_CREATE_COMPETENCE_ERROR';
export const COMPETENCES_DELETE_COMPETENCE_REQUEST =
    'COMPETENCES_DELETE_COMPETENCE_REQUEST';
export const COMPETENCES_DELETE_COMPETENCE_SUCCESS =
    'COMPETENCES_DELETE_COMPETENCE_SUCCESS';
export const COMPETENCES_DELETE_COMPETENCE_ERROR =
    'COMPETENCES_DELETE_COMPETENCE_ERROR';
export const COMPETENCES_GET_COMPETENCES_REQUEST =
    'COMPETENCES_GET_COMPETENCES_REQUEST';
export const COMPETENCES_GET_COMPETENCES_SUCCESS =
    'COMPETENCES_GET_COMPETENCES_SUCCESS';
export const COMPETENCES_GET_COMPETENCES_ERROR =
    'COMPETENCES_GET_COMPETENCES_ERROR';
export const COMPETENCES_ADD_TO_DOC_REQUEST = 'COMPETENCES_ADD_TO_DOC_REQUEST';
export const COMPETENCES_ADD_TO_DOC_SUCCESS = 'COMPETENCES_ADD_TO_DOC_SUCCESS';
export const COMPETENCES_ADD_TO_DOC_ERROR = 'COMPETENCES_ADD_TO_DOC_ERROR';
export const COMPETENCES_REM_FROM_DOC_REQUEST =
    'COMPETENCES_REM_FROM_DOC_REQUEST';
export const COMPETENCES_REM_FROM_DOC_SUCCESS =
    'COMPETENCES_REM_FROM_DOC_SUCCESS';
export const COMPETENCES_REM_FROM_DOC_ERROR = 'COMPETENCES_REM_FROM_DOC_ERROR';

import * as API from './api';

export function create_competence(name: string, description?: string) {
    return {
        types: [
            COMPETENCES_CREATE_COMPETENCE_REQUEST,
            COMPETENCES_CREATE_COMPETENCE_SUCCESS,
            COMPETENCES_CREATE_COMPETENCE_ERROR
        ],
        api: API.create_competence(name, description)
    };
}

export function add_competence_to_doc(doc_id: string, competence_id: string) {
    return {
        types: [
            COMPETENCES_ADD_TO_DOC_REQUEST,
            COMPETENCES_ADD_TO_DOC_SUCCESS,
            COMPETENCES_ADD_TO_DOC_ERROR
        ],
        api: API.add_competence_to_doc(doc_id, competence_id),
        payload: { doc_id, competence_id }
    };
}

export function rem_competence_from_doc(doc_id: string, competence_id: string) {
    return {
        types: [
            COMPETENCES_REM_FROM_DOC_REQUEST,
            COMPETENCES_REM_FROM_DOC_SUCCESS,
            COMPETENCES_REM_FROM_DOC_ERROR
        ],
        api: API.rem_competence_from_doc(doc_id, competence_id),
        payload: { doc_id, competence_id }
    };
}

export function delete_competence(competence_id: string) {
    return {
        types: [
            COMPETENCES_DELETE_COMPETENCE_REQUEST,
            COMPETENCES_DELETE_COMPETENCE_SUCCESS,
            COMPETENCES_DELETE_COMPETENCE_ERROR
        ],
        api: API.delete_competence(competence_id),
        payload: { competence_id }
    };
}

export function get_competences(doc_id?: string) {
    return {
        types: [
            COMPETENCES_GET_COMPETENCES_REQUEST,
            COMPETENCES_GET_COMPETENCES_SUCCESS,
            COMPETENCES_GET_COMPETENCES_ERROR
        ],
        api: API.get_competences(doc_id)
    };
}

export function create_competence_and_add_to_doc(
    doc_id: string,
    competence_name: string
) {
    return dispatch => {
        API.create_competence(competence_name)
            .then(res => {
                dispatch({
                    type: COMPETENCES_CREATE_COMPETENCE_SUCCESS,
                    payload: res.body
                });
                dispatch(add_competence_to_doc(doc_id, res.body._id));
            })
            .catch();
    };
}

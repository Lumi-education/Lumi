import * as shortid from 'shortid';

export const TAGS_CREATE_TAG_REQUEST = 'TAGS_CREATE_TAG_REQUEST';
export const TAGS_CREATE_TAG_SUCCESS = 'TAGS_CREATE_TAG_SUCCESS';
export const TAGS_CREATE_TAG_ERROR = 'TAGS_CREATE_TAG_ERROR';
export const TAGS_DELETE_TAG_REQUEST = 'TAGS_DELETE_TAG_REQUEST';
export const TAGS_DELETE_TAG_SUCCESS = 'TAGS_DELETE_TAG_SUCCESS';
export const TAGS_DELETE_TAG_ERROR = 'TAGS_DELETE_TAG_ERROR';
export const TAGS_GET_TAGS_REQUEST = 'TAGS_GET_TAGS_REQUEST';
export const TAGS_GET_TAGS_SUCCESS = 'TAGS_GET_TAGS_SUCCESS';
export const TAGS_GET_TAGS_ERROR = 'TAGS_GET_TAGS_ERROR';
export const TAGS_ADD_TO_DOC_REQUEST = 'TAGS_ADD_TO_DOC_REQUEST';
export const TAGS_ADD_TO_DOC_SUCCESS = 'TAGS_ADD_TO_DOC_SUCCESS';
export const TAGS_ADD_TO_DOC_ERROR = 'TAGS_ADD_TO_DOC_ERROR';
export const TAGS_REM_FROM_DOC_REQUEST = 'TAGS_REM_FROM_DOC_REQUEST';
export const TAGS_REM_FROM_DOC_SUCCESS = 'TAGS_REM_FROM_DOC_SUCCESS';
export const TAGS_REM_FROM_DOC_ERROR = 'TAGS_REM_FROM_DOC_ERROR';

import * as API from './api';

export function create_tag(name: string, description?: string) {
    return {
        types: [
            TAGS_CREATE_TAG_REQUEST,
            TAGS_CREATE_TAG_SUCCESS,
            TAGS_CREATE_TAG_ERROR
        ],
        api: API.create_tag(name, description)
    };
}

export function add_tag_to_doc(doc_id: string, tag_id: string) {
    return {
        types: [
            TAGS_ADD_TO_DOC_REQUEST,
            TAGS_ADD_TO_DOC_SUCCESS,
            TAGS_ADD_TO_DOC_ERROR
        ],
        api: API.add_tag_to_doc(doc_id, tag_id),
        payload: { doc_id, tag_id }
    };
}

export function rem_tag_from_doc(doc_id: string, tag_id: string) {
    return {
        types: [
            TAGS_REM_FROM_DOC_REQUEST,
            TAGS_REM_FROM_DOC_SUCCESS,
            TAGS_REM_FROM_DOC_ERROR
        ],
        api: API.rem_tag_from_doc(doc_id, tag_id),
        payload: { doc_id, tag_id }
    };
}

export function delete_tag(tag_id: string) {
    return {
        types: [
            TAGS_DELETE_TAG_REQUEST,
            TAGS_DELETE_TAG_SUCCESS,
            TAGS_DELETE_TAG_ERROR
        ],
        api: API.delete_tag(tag_id),
        payload: { tag_id }
    };
}

export function get_tags(doc_id?: string) {
    return {
        types: [
            TAGS_GET_TAGS_REQUEST,
            TAGS_GET_TAGS_SUCCESS,
            TAGS_GET_TAGS_ERROR
        ],
        api: API.get_tags(doc_id)
    };
}

export function create_tag_and_add_to_doc(doc_id: string, tag_name: string) {
    return dispatch => {
        API.create_tag(tag_name)
            .then(res => {
                dispatch({
                    type: TAGS_CREATE_TAG_SUCCESS,
                    payload: res.body
                });
                dispatch(add_tag_to_doc(doc_id, res.body._id));
            })
            .catch();
    };
}

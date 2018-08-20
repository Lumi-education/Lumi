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
export const TAGS_UI_SELECT_TAG_ID = 'TAGS_UI_SELECT_TAG_ID';

export const TAGS_UPDATE_TAG_REUQEST = 'TAGS_UPDATE_TAG_REQUEST';
export const TAGS_UPDATE_TAG_SUCCESS = 'TAGS_UPDATE_TAG_SUCCESS';
export const TAGS_UPDATE_TAG_ERROR = 'TAGS_UPDATE_TAG_ERROR';

export const TAGS_UI_TOGGLE_DIALOG = 'TAGS_UI_TOGGLE_DIALOG';
export const TAGS_UI_CHANGE_TAG = 'TAGS_UI_CHANGE_TAG';
export const TAGS_UI_RESET_TAG = 'TAGS_UI_RESET_TAG';

import * as API from './api';

export function create_tag(name: string, tag?: any) {
    return {
        types: [
            TAGS_CREATE_TAG_REQUEST,
            TAGS_CREATE_TAG_SUCCESS,
            TAGS_CREATE_TAG_ERROR
        ],
        api: API.create_tag(name, tag)
    };
}

export function add_tag_to_doc(doc_ids: string[], tag_ids: string[]) {
    return {
        types: [
            TAGS_ADD_TO_DOC_REQUEST,
            TAGS_ADD_TO_DOC_SUCCESS,
            TAGS_ADD_TO_DOC_ERROR
        ],
        api: API.add_tags_to_docs(doc_ids, tag_ids),
        payload: { doc_ids, tag_ids }
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

export function select_tag(tag_id: string) {
    return {
        type: TAGS_UI_SELECT_TAG_ID,
        payload: {
            tag_id
        }
    };
}

export function toggle_tags_dialog() {
    return {
        type: TAGS_UI_TOGGLE_DIALOG
    };
}

export function change_tag(payload: any) {
    return {
        payload,
        type: TAGS_UI_CHANGE_TAG
    };
}

export function reset_tag() {
    return {
        type: TAGS_UI_RESET_TAG
    };
}

export function update_tag(tag_id: string, update: any) {
    return {
        types: [
            TAGS_UPDATE_TAG_REUQEST,
            TAGS_UPDATE_TAG_SUCCESS,
            TAGS_UPDATE_TAG_ERROR
        ],
        api: API.update_tag(tag_id, update)
    };
}

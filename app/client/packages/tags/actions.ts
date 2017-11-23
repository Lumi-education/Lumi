import * as shortid from 'shortid';

import * as types from 'client/packages/action-types';

import * as API from './api';

import { add_tag_to_card } from 'client/packages/cards/actions';

export function create_tag(name: string, description?: string) {
    return {
        types: [
            types.TAGS_CREATE_TAG_REQUEST,
            types.TAGS_CREATE_TAG_SUCCESS,
            types.TAGS_CREATE_TAG_ERROR
        ],
        api: API.create_tag(name, description)
    };
}

export function add_tag_to_doc(doc_id: string, tag_id: string) {
    return {
        types: [
            types.TAGS_ADD_TO_DOC_REQUEST,
            types.TAGS_ADD_TO_DOC_SUCCESS,
            types.TAGS_ADD_TO_DOC_ERROR
        ],
        api: API.add_tag_to_doc(doc_id, tag_id),
        payload: { doc_id, tag_id }
    };
}

export function rem_tag_from_doc(doc_id: string, tag_id: string) {
    return {
        types: [
            types.TAGS_REM_FROM_DOC_REQUEST,
            types.TAGS_REM_FROM_DOC_SUCCESS,
            types.TAGS_REM_FROM_DOC_ERROR
        ],
        api: API.rem_tag_from_doc(doc_id, tag_id),
        payload: { doc_id, tag_id }
    };
}

export function delete_tag(tag_id: string) {
    return {
        types: [
            types.TAGS_DELETE_TAG_REQUEST,
            types.TAGS_DELETE_TAG_SUCCESS,
            types.TAGS_DELETE_TAG_ERROR
        ],
        api: API.delete_tag(tag_id),
        payload: { tag_id }
    };
}

export function get_tags() {
    return {
        types: [
            types.TAGS_GET_TAGS_REQUEST,
            types.TAGS_GET_TAGS_SUCCESS,
            types.TAGS_GET_TAGS_ERROR
        ],
        api: API.get_tags()
    };
}

export function create_tag_and_add_to_doc(doc_id: string, tag_name: string) {
    return dispatch => {
        API.create_tag(tag_name)
            .then(res => {
                dispatch({
                    type: types.TAGS_CREATE_TAG_SUCCESS,
                    payload: res.body
                });
                dispatch(add_tag_to_doc(doc_id, res.body._id));
            })
            .catch();
    };
}

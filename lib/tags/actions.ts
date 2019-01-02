export const TAGS_CREATE_TAG_REQUEST = 'TAGS_CREATE_TAG_REQUEST';
export const TAGS_CREATE_TAG_SUCCESS = 'TAGS_CREATE_TAG_SUCCESS';
export const TAGS_CREATE_TAG_ERROR = 'TAGS_CREATE_TAG_ERROR';
export const TAGS_DELETE_TAG_REQUEST = 'TAGS_DELETE_TAG_REQUEST';
export const TAGS_DELETE_TAG_SUCCESS = 'TAGS_DELETE_TAG_SUCCESS';
export const TAGS_DELETE_TAG_ERROR = 'TAGS_DELETE_TAG_ERROR';
export const TAGS_UI_SELECT_TAG_ID = 'TAGS_UI_SELECT_TAG_ID';
export const TAGS_UPDATE_TAG_REUQEST = 'TAGS_UPDATE_TAG_REQUEST';
export const TAGS_UPDATE_TAG_SUCCESS = 'TAGS_UPDATE_TAG_SUCCESS';
export const TAGS_UPDATE_TAG_ERROR = 'TAGS_UPDATE_TAG_ERROR';
export const TAGS_UI_CHANGE_TAG = 'TAGS_UI_CHANGE_TAG';
export const TAGS_UI_RESET_TAG = 'TAGS_UI_RESET_TAG';
export const TAGS_UI_SET_SELECTED_TAGS = 'TAGS_UI_SET_SELECTED_TAGS';

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

export function select_tag(tag_id: string) {
    // deprecate with universal selection module #286
    return {
        type: TAGS_UI_SELECT_TAG_ID,
        payload: {
            tag_id
        }
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

export function set_selected_tags(tag_ids: string[]) {
    // deprecate with universal selection module #286
    return {
        type: TAGS_UI_SET_SELECTED_TAGS,
        payload: {
            tag_ids
        }
    };
}

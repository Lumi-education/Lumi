export const CORE_SHOW_ATTACHMENT_DIALOG = 'CORE_SHOW_ATTACHMENT_DIALOG';
export const CORE_HIDE_ATTACHMENT_DIALOG = 'CORE_HIDE_ATTACHMENT_DIALOG';
export const CORE_DB_FIND_REQUEST = 'CORE_DB_FIND_REQUEST';
export const CORE_DB_FIND_SUCCESS = 'CORE_DB_FIND_SUCCESS';
export const CORE_DB_FIND_ERROR = 'CORE_DB_FIND_ERROR';
export const CORE_DB_CHANGE = 'DB_CHANGE';
export const CORE_DB_UPDATE_REQUEST = 'CORE_DB_UPDATE_REQUEST';
export const CORE_DB_UPDATE_ERROR = 'CORE_DB_UPDATE_ERROR';
export const CORE_ACTION_REQUEST = 'CORE_ACTION_REQUEST';
export const CORE_ACTION_SUCCESS = 'CORE_ACTION_SUCCESS';
export const CORE_ACTION_ERROR = 'CORE_ACTION_ERROR';
export const CORE_DOC_REQUEST = 'CORE_DOC_REQUEST';
export const CORE_DOC_ERROR = 'CORE_DOC_ERROR';

import * as API from './api';

export function show_attachment_dialog(doc_id: string, _attachments) {
    return {
        type: CORE_SHOW_ATTACHMENT_DIALOG,
        payload: { doc_id, _attachments }
    };
}

export function hide_attachment_dialog() {
    return {
        type: CORE_HIDE_ATTACHMENT_DIALOG,
        payload: {}
    };
}

export function find(query, options?) {
    return {
        types: [CORE_DB_FIND_REQUEST, CORE_DB_CHANGE, CORE_DB_FIND_ERROR],
        api: API.find(query, options),
        payload: { query, options }
    };
}

export function get(id: string) {
    return {
        types: [CORE_DOC_REQUEST, CORE_DB_CHANGE, CORE_DOC_ERROR],
        api: API.doc(id),
        payload: { id }
    };
}

export function update(ids: string[], _update) {
    return {
        types: [CORE_DB_UPDATE_REQUEST, CORE_DB_CHANGE, CORE_DB_UPDATE_ERROR],
        api: API.update(ids, _update),
        payload: { ids, update: _update }
    };
}

export function action(_action: string, ids: string[], payload?) {
    return {
        types: [CORE_ACTION_REQUEST, CORE_ACTION_SUCCESS, CORE_ACTION_ERROR],
        api: API.action(_action, ids, payload),
        payload: { ids, payload, action: _action }
    };
}

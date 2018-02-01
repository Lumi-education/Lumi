export const CORE_SHOW_ATTACHMENT_DIALOG = 'CORE_SHOW_ATTACHMENT_DIALOG';
export const CORE_HIDE_ATTACHMENT_DIALOG = 'CORE_HIDE_ATTACHMENT_DIALOG';
export const CORE_DB_FIND_REQUEST = 'CORE_DB_FIND_REQUEST';
export const CORE_DB_FIND_SUCCESS = 'CORE_DB_FIND_SUCCESS';
export const CORE_DB_FIND_ERROR = 'CORE_DB_FIND_ERROR';
export const CORE_DB_CHANGE = 'DB_CHANGE';

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

export function find(query) {
    return {
        types: [CORE_DB_FIND_REQUEST, CORE_DB_CHANGE, CORE_DB_FIND_ERROR],
        api: API.find(query),
        payload: { query }
    };
}

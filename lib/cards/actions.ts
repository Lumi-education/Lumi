import * as API from './api';

export const CARDS_GET_CARDS_REQUEST = 'CARDS_GET_CARDS_REQUEST';
export const CARDS_GET_CARDS_SUCCESS = 'CARDS_GET_CARDS_SUCCESS';
export const CARDS_GET_CARDS_ERROR = 'CARDS_GET_CARDS_ERROR';
export const CARDS_CREATE_CARD_REQUEST = 'CARDS_CREATE_CARD_REQUEST';
export const CARDS_CREATE_CARD_SUCCESS = 'CARDS_CREATE_CARD_SUCCESS';
export const CARDS_CREATE_CARD_ERROR = 'CARDS_CREATE_CARD_ERROR';
export const CARDS_UPDATE_CARD_REQUEST = 'CARDS_UPDATE_CARD_REQUEST';
export const CARDS_UPDATE_CARD_SUCCESS = 'CARDS_UPDATE_CARD_SUCCESS';
export const CARDS_UPDATE_CARD_ERROR = 'CARDS_UPDATE_CARD_ERROR';
export const CARDS_DELETE_CARD_REQUEST = 'CARDS_DELETECARD_REQUEST';
export const CARDS_DELETE_CARD_SUCCESS = 'CARDS_DELETE_CARD_SUCCESS';
export const CARDS_DELETE_CARD_ERROR = 'CARDS_DELETE_CARD_ERROR';
export const CARDS_REM_TAG_REQUEST = 'CARDS_REM_TAG_REQUEST';
export const CARDS_REM_TAG_SUCCESS = 'CARDS_REM_TAG_SUCCESS';
export const CARDS_REM_TAG_ERROR = 'CARDS_REM_TAG_ERROR';
export const CARDS_ADD_TAG_REQUEST = 'CARDS_ADD_TAG_REQUEST';
export const CARDS_ADD_TAG_SUCCESS = 'CARDS_ADD_TAG_SUCCESS';
export const CARDS_ADD_TAG_ERROR = 'CARDS_ADD_TAG_ERROR';
export const CARD_SELECT = 'CARD_SELECT';
export const CARD_SELECTION_RESET = 'CARD_SELECTION_RESET';
export const CARDS_UI_CHANGE_CARD = 'CARDS_UI_CHANGE_CARD';
export const CARDS_UI_RESET_CARD = 'CARDS_UI_RESET_CARD';
export const CARDS_UI_SET_SELECTED_CARDS = 'CARDS_UI_SET_SELECTED_CARDS';
export const CARDS_DUPLICATE_REQUEST = 'CARDS_DUPLICATE_REQUEST';
export const CARDS_DUPLICATE_SUCCESS = 'CARDS_DUPLICATE_SUCCESS';
export const CARDS_DUPLICATE_ERROR = 'CARDS_DUPLICATE_ERROR';

import { Subjects } from './types';

export function get_cards(ids?: string[]) {
    return {
        types: [
            CARDS_GET_CARDS_REQUEST,
            CARDS_GET_CARDS_SUCCESS,
            CARDS_GET_CARDS_ERROR
        ],
        api: API.get_cards(ids)
    };
}

export function update_card(card_id: string, update) {
    return {
        types: [
            CARDS_UPDATE_CARD_REQUEST,
            CARDS_UPDATE_CARD_SUCCESS,
            CARDS_UPDATE_CARD_ERROR
        ],
        api: API.update_card(card_id, update),
        payload: { card_id, update }
    };
}

export function create_card(card?) {
    return {
        types: [
            CARDS_CREATE_CARD_REQUEST,
            CARDS_CREATE_CARD_SUCCESS,
            CARDS_CREATE_CARD_ERROR
        ],
        api: API.create_card(card),
        payload: { card }
    };
}

export function delete_card(card_id: string) {
    return {
        types: [
            CARDS_DELETE_CARD_REQUEST,
            CARDS_DELETE_CARD_SUCCESS,
            CARDS_DELETE_CARD_ERROR
        ],
        api: API.delete_card(card_id),
        payload: { card_id }
    };
}

export function select_card(card_id: string) {
    return {
        type: CARD_SELECT,
        payload: {
            card_id
        }
    };
}

export function set_selected_cards(card_ids: string[]) {
    return {
        card_ids,
        type: CARDS_UI_SET_SELECTED_CARDS
    };
}

export function reset_card_selection() {
    return {
        type: CARD_SELECTION_RESET
    };
}

export function change_card(payload: any) {
    return {
        payload,
        type: CARDS_UI_CHANGE_CARD
    };
}
export function reset_card() {
    return {
        type: CARDS_UI_RESET_CARD
    };
}

export function duplicate(card_id: string) {
    return {
        types: [
            CARDS_DUPLICATE_REQUEST,
            CARDS_DUPLICATE_SUCCESS,
            CARDS_DUPLICATE_ERROR
        ],
        api: API.duplicate(card_id),
        payload: { card_id }
    };
}

export const CARDS_CHANGE_SUBJECT = 'CARDS_CHANGE_SUBJECT';

export function change_subject(subject: Subjects) {
    return {
        subject,
        type: CARDS_CHANGE_SUBJECT
    };
}

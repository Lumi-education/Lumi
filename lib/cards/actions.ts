import * as API from './api';

import * as k from './constants';

export const DATA_GET_CARD_DATA_REQUEST = 'DATA_GET_CARD_DATA_REQUEST';
export const DATA_GET_CARD_DATA_SUCCESS = 'DATA_GET_CARD_DATA_SUCCESS';
export const DATA_GET_CARD_DATA_ERROR = 'DATA_GET_CARD_DATA_ERROR';
export const CARDS_UI_CHANGE_CARD = 'CARDS_UI_CHANGE_CARD';
export const CARDS_UI_RESET_CARD = 'CARDS_UI_RESET_CARD';

export function get_cards(ids?: string[]) {
    return {
        types: [
            k.CARDS_GET_CARDS_REQUEST,
            k.CARDS_GET_CARDS_SUCCESS,
            k.CARDS_GET_CARDS_ERROR
        ],
        api: API.get_cards(ids)
    };
}

export function get_card(card_id: string) {
    return {
        types: [
            k.CARDS_GET_CARD_REQUEST,
            k.CARDS_GET_CARD_SUCCESS,
            k.CARDS_GET_CARD_ERROR
        ],
        api: API.get_card(card_id),
        payload: { card_id }
    };
}

export function update_card(card_id: string, update) {
    return {
        types: [
            k.CARDS_UPDATE_CARD_REQUEST,
            k.CARDS_UPDATE_CARD_SUCCESS,
            k.CARDS_UPDATE_CARD_ERROR
        ],
        api: API.update_card(card_id, update),
        payload: { card_id, update }
    };
}

export function create_card(card?) {
    return {
        types: [
            k.CARDS_CREATE_CARD_REQUEST,
            k.CARDS_CREATE_CARD_SUCCESS,
            k.CARDS_CREATE_CARD_ERROR
        ],
        api: API.create_card(card),
        payload: { card }
    };
}

export function delete_card(card_id: string) {
    return {
        types: [
            k.CARDS_DELETE_CARD_REQUEST,
            k.CARDS_DELETE_CARD_SUCCESS,
            k.CARDS_DELETE_CARD_ERROR
        ],
        api: API.delete_card(card_id),
        payload: { card_id }
    };
}

export function select_card(card_id: string) {
    return {
        type: k.CARD_SELECT,
        payload: {
            card_id
        }
    };
}

export function reset_card_selection() {
    return {
        type: k.CARD_SELECTION_RESET
    };
}

export function create_data<T>(data: T) {
    return {
        types: [
            k.DATA_CREATE_REQUEST,
            k.DATA_CREATE_SUCCESS,
            k.DATA_CREATE_ERROR
        ],
        api: API.create_data(data),
        payload: { data }
    };
}

export function get_user_collection_data(collection_id: string) {
    return {
        types: [k.DATA_GET_REQUEST, k.DATA_GET_SUCCESS, k.DATA_GET_ERROR],
        api: API.get_user_collection_data(collection_id),
        payload: { collection_id }
    };
}
export function get_card_data(
    user_id: string,
    collection_id: string,
    card_id: string
) {
    return {
        types: [
            DATA_GET_CARD_DATA_REQUEST,
            DATA_GET_CARD_DATA_SUCCESS,
            DATA_GET_CARD_DATA_ERROR
        ],
        api: API.get_card_data(user_id, collection_id, card_id),
        payload: { user_id, collection_id, card_id }
    };
}

export function update_data(data) {
    return {
        types: [
            k.DATA_UPDATE_REQUEST,
            k.DATA_UPDATE_SUCCESS,
            k.DATA_UPDATE_ERROR
        ],
        api: API.update_data(data),
        payload: { data }
    };
}

export function get_h5p(content_id: string) {
    return {
        types: ['GET_H5P_REQUEST', 'GET_H5P_SUCCESS', 'GET_H5P_ERROR'],
        api: API.get_h5p(content_id),
        payload: { content_id }
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

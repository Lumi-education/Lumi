import * as API from './api';

import { ICard } from './types';

import * as k from './constants';

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

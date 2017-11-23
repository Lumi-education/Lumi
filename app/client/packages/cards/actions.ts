import * as shortid from 'shortid';

import * as API from './api';

import { ICard } from 'common/types';

import * as types from '../action-types';

export function get_cards(id = shortid()) {
    return {
        types: [
            types.CARDS_GET_CARDS_REQUEST,
            types.CARDS_GET_CARDS_SUCCESS,
            types.CARDS_GET_CARDS_ERROR
        ],
        api: API.get_cards(),
        payload: { id }
    };
}

export function get_card(card_id: string, id = shortid()) {
    return {
        types: [
            types.CARDS_GET_CARD_REQUEST,
            types.CARDS_GET_CARD_SUCCESS,
            types.CARDS_GET_CARD_ERROR
        ],
        api: API.get_card(card_id),
        payload: { card_id, id }
    };
}

export function update_card(card_id: string, update) {
    return {
        types: [
            types.CARDS_UPDATE_CARD_REQUEST,
            types.CARDS_UPDATE_CARD_SUCCESS,
            types.CARDS_UPDATE_CARD_ERROR
        ],
        api: API.update_card(card_id, update),
        payload: { card_id, update }
    };
}

export function create_card(card?) {
    return {
        types: [
            types.CARDS_CREATE_CARD_REQUEST,
            types.CARDS_CREATE_CARD_SUCCESS,
            types.CARDS_CREATE_CARD_ERROR
        ],
        api: API.create_card(card),
        payload: { card }
    };
}

export function delete_card(card_id: string) {
    return {
        types: [
            types.CARDS_DELETE_CARD_REQUEST,
            types.CARDS_DELETE_CARD_SUCCESS,
            types.CARDS_DELETE_CARD_ERROR
        ],
        api: API.delete_card(card_id),
        payload: { card_id }
    };
}

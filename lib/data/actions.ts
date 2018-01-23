import * as API from './api';

import {
    DATA_CREATE_REQUEST,
    DATA_CREATE_SUCCESS,
    DATA_CREATE_ERROR,
    DATA_GET_REQUEST,
    DATA_GET_SUCCESS,
    DATA_GET_ERROR,
    DATA_UPDATE_REQUEST,
    DATA_UPDATE_SUCCESS,
    DATA_UPDATE_ERROR
} from './constants';

export const DATA_GET_CARD_DATA_REQUEST = 'DATA_GET_CARD_DATA_REQUEST';
export const DATA_GET_CARD_DATA_SUCCESS = 'DATA_GET_CARD_DATA_SUCCESS';
export const DATA_GET_CARD_DATA_ERROR = 'DATA_GET_CARD_DATA_ERROR';

export function create_data<T>(data: T) {
    return {
        types: [DATA_CREATE_REQUEST, DATA_CREATE_SUCCESS, DATA_CREATE_ERROR],
        api: API.create_data(data),
        payload: { data }
    };
}

export function get_user_collection_data(collection_id: string) {
    return {
        types: [DATA_GET_REQUEST, DATA_GET_SUCCESS, DATA_GET_ERROR],
        api: API.get_user_collection_data(collection_id),
        payload: { collection_id }
    };
}

export function get_data(query) {
    return {
        types: [DATA_GET_REQUEST, DATA_GET_SUCCESS, DATA_GET_ERROR],
        api: API.get_data(query),
        payload: { query }
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
        types: [DATA_UPDATE_REQUEST, DATA_UPDATE_SUCCESS, DATA_UPDATE_ERROR],
        api: API.update_data(data),
        payload: { data }
    };
}

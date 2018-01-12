import * as shortid from 'shortid';
import { push } from 'lib/ui/actions';

import * as API from './api';

import * as k from './constants';

export function get_collections(_ids?: string[]) {
    return {
        types: [
            k.COLLECTION_GET_REQUEST,
            k.COLLECTION_GET_SUCCESS,
            k.COLLECTION_GET_ERROR
        ],
        api: API.get_collections(_ids),
        payload: { _ids }
    };
}

export function add_cards_to_collection(
    collection_id: string,
    card_ids: string[]
) {
    return {
        types: [
            k.COLLECTION_ADD_CARDS_REQUEST,
            k.COLLECTION_ADD_CARDS_SUCCESS,
            k.COLLECTION_ADD_CARDS_ERROR
        ],
        api: API.add_cards_to_collection(collection_id, card_ids),
        payload: { card_ids }
    };
}

export function delete_collection(collection_id: string) {
    return {
        types: [
            k.COLLECTION_DELETE_COLLECTION_REQUEST,
            k.COLLECTION_DELETE_COLLECTION_SUCCESS,
            k.COLLECTION_DELETE_COLLECTION_ERROR
        ],
        api: API.delete_collection(collection_id),
        payload: { collection_id }
    };
}

export function create_collection() {
    return {
        types: [
            k.COLLECTIONS_CREATE_COLLECTION_REQUEST,
            k.COLLECTIONS_CREATE_COLLECTION_SUCCESS,
            k.COLLECTIONS_CREATE_COLLECTION_ERROR
        ],
        api: API.post_collection()
    };
}

export function update_collection(collection_id: string, update) {
    return {
        types: [
            k.COLLECTIONS_UPDATE_COLLECTION_REQUEST,
            k.COLLECTIONS_UPDATE_COLLECTION_SUCCESS,
            k.COLLECTIONS_UPDATE_COLLECTION_ERROR
        ],
        api: API.update_collection(collection_id, update),
        payload: { collection_id, update }
    };
}

export function get_collection(collection_id: string) {
    return {
        types: [
            k.COLLECTION_GET_REQUEST,
            k.COLLECTION_GET_SUCCESS,
            k.COLLECTION_GET_ERROR
        ],
        api: API.get_collections([collection_id]),
        payload: { collection_id }
    };
}

export function get_user_collections() {
    return {
        types: [
            k.COLLECTION_GET_REQUEST,
            k.COLLECTION_GET_SUCCESS,
            k.COLLECTION_GET_ERROR
        ],
        api: API.get_user_collections()
    };
}

export function collection_create_meta(
    collection_id: string,
    id: string = shortid()
) {
    return {
        types: [
            k.COLLECTION_CREATEMETA_REQUEST,
            k.COLLECTION_CREATEMETA_SUCCESS,
            k.COLLECTION_CREATEMETA_ERROR
        ],
        api: API.post_collectionmeta(collection_id),
        payload: { id, collection_id }
    };
}

export function submit_collection(collection_id: string) {
    return {
        types: [
            k.COLLECTION_SUBMIT_REQUEST,
            k.COLLECTION_SUBMIT_SUCCESS,
            k.COLLECTION_SUBMIT_ERROR
        ],
        api: API.submit_collection(collection_id),
        payload: { payload: { collection_id } }
    };
}

export function reset_collection(collection_meta_id: string) {
    return {
        types: [
            k.COLLECTION_RESET_REQUEST,
            k.COLLECTION_RESET_SUCCESS,
            k.COLLECTION_RESET_ERROR
        ],
        api: API.reset_collection(collection_meta_id),
        payload: { payload: { collection_meta_id } }
    };
}

export function select_collection(collection_id: string) {
    return {
        type: k.COLLECTION_SELECT,
        payload: {
            collection_id
        }
    };
}

export function reset_collection_selection() {
    return {
        type: k.COLLECTION_SELECTION_RESET
    };
}

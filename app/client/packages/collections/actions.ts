import * as shortid from 'shortid';
import { push } from 'react-router-redux';

import * as API from './api';

import * as types from '../action-types';

export function get_collections(id = shortid()) {
    return {
        types: [
            types.COLLECTION_GET_REQUEST,
            types.COLLECTION_GET_SUCCESS,
            types.COLLECTION_GET_ERROR
        ],
        api: API.get_collections(),
        payload: { id }
    };
}

export function add_cards_to_collection(
    collection_id: string,
    card_ids: string[]
) {
    return {
        types: [
            types.COLLECTION_ADD_CARDS_REQUEST,
            types.COLLECTION_ADD_CARDS_SUCCESS,
            types.COLLECTION_ADD_CARDS_ERROR
        ],
        api: API.add_cards_to_collection(collection_id, card_ids),
        payload: { card_ids }
    };
}

export function create_collection_and_push() {
    return dispatch => {
        dispatch({ type: types.COLLECTIONS_CREATE_COLLECTION_REQUEST });

        API.post_collection()
            .then(res => {
                switch (res.status) {
                    case 201:
                    case 200:
                        dispatch({
                            type: types.COLLECTIONS_CREATE_COLLECTION_SUCCESS,
                            payload: res.body
                        });
                        dispatch(push('/admin/collections/' + res.body._id));
                        break;
                    default:
                        break;
                }
            })
            .catch(err => {
                dispatch({
                    type: types.COLLECTIONS_CREATE_COLLECTION_ERROR,
                    payload: { response: err }
                });
            });
    };
}

export function update_collection(collection_id: string, update) {
    return {
        types: [
            types.COLLECTIONS_UPDATE_COLLECTION_REQUEST,
            types.COLLECTIONS_UPDATE_COLLECTION_SUCCESS,
            types.COLLECTIONS_UPDATE_COLLECTION_ERROR
        ],
        api: API.update_collection(collection_id, update),
        payload: { collection_id, update }
    };
}

export function get_collection(collection_id: string) {
    return {
        types: [
            types.COLLECTION_GET_REQUEST,
            types.COLLECTION_GET_SUCCESS,
            types.COLLECTION_GET_ERROR
        ],
        api: API.get_collections(collection_id),
        payload: { collection_id }
    };
}

export function get_user_collections() {
    return {
        types: [
            types.COLLECTION_GET_REQUEST,
            types.COLLECTION_GET_SUCCESS,
            types.COLLECTION_GET_ERROR
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
            types.COLLECTION_CREATEMETA_REQUEST,
            types.COLLECTION_CREATEMETA_SUCCESS,
            types.COLLECTION_CREATEMETA_ERROR
        ],
        api: API.post_collectionmeta(collection_id),
        payload: { id, collection_id }
    };
}

export function submit_collection(
    collection_meta_id: string,
    id: string = shortid()
) {
    return {
        types: [
            types.COLLECTION_SUBMIT_REQUEST,
            types.COLLECTION_SUBMIT_SUCCESS,
            types.COLLECTION_SUBMIT_ERROR
        ],
        api: API.submit_collection(collection_meta_id),
        payload: { payload: { collection_meta_id } }
    };
}

export function reset_collection(collection_meta_id: string) {
    return {
        types: [
            types.COLLECTION_RESET_REQUEST,
            types.COLLECTION_RESET_SUCCESS,
            types.COLLECTION_RESET_ERROR
        ],
        api: API.reset_collection(collection_meta_id),
        payload: { payload: { collection_meta_id } }
    };
}

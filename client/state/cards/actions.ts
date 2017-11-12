import * as shortid from 'shortid';

import * as API from './api';

import { ICard } 	from 'lib/types';

import {
	CARDS_GET_CARDS_REQUEST,
	CARDS_GET_CARDS_SUCCESS,
	CARDS_GET_CARDS_ERROR,

	CARDS_ADD_TAG_REQUEST,
	CARDS_ADD_TAG_SUCCESS,
	CARDS_ADD_TAG_ERROR,

	CARDS_REM_TAG_REQUEST,
	CARDS_REM_TAG_SUCCESS,
	CARDS_REM_TAG_ERROR,

	CARDS_UPDATE_CARD_REQUEST,
	CARDS_UPDATE_CARD_SUCCESS,
	CARDS_UPDATE_CARD_ERROR,

	CARDS_DELETE_CARD_REQUEST,
	CARDS_DELETE_CARD_SUCCESS,
	CARDS_DELETE_CARD_ERROR
} from '../action-types';

import * as types	from '../action-types';

export function get_cards(id = shortid() ) {
	return {
		types: [CARDS_GET_CARDS_REQUEST, CARDS_GET_CARDS_SUCCESS, CARDS_GET_CARDS_ERROR],
		api: API.get_cards(),
		payload: { id }
	};
}

export function get_card(card_id: string, id = shortid() ) {
	return {
		types: [types.CARDS_GET_CARD_REQUEST, types.CARDS_GET_CARD_SUCCESS, types.CARDS_GET_CARD_ERROR],
		api: API.get_card( card_id ),
		payload: { card_id, id }
	};
}

export function update_card(card_id: string, update) {
	return {
		types: [CARDS_UPDATE_CARD_REQUEST, CARDS_UPDATE_CARD_SUCCESS, CARDS_UPDATE_CARD_ERROR],
		api: API.update_card( card_id, update ),
		payload: { card_id, update }
	};
}

export function create_card(card?) {
	return {
		types: [types.CARDS_CREATE_CARD_REQUEST, types.CARDS_CREATE_CARD_SUCCESS, types.CARDS_CREATE_CARD_ERROR],
		api: API.create_card( card ),
		payload: { card }
	};
}

export function delete_card(card_id: string) {
	return {
		types: [CARDS_DELETE_CARD_REQUEST, CARDS_DELETE_CARD_SUCCESS, CARDS_DELETE_CARD_ERROR],
		api: API.delete_card( card_id ),
		payload: { card_id }
	};
}

export function rem_tag_from_card(card_id: string, tag_id: string) {
	return {
		types: [CARDS_REM_TAG_REQUEST, CARDS_REM_TAG_SUCCESS, CARDS_REM_TAG_ERROR],
		api: API.rem_tag(card_id, tag_id),
		payload: { card_id, tag_id }
	};
}

export function add_tag_to_card(card_id: string, tag_id: string) {
	return {
		types: [CARDS_ADD_TAG_REQUEST, CARDS_ADD_TAG_SUCCESS, CARDS_ADD_TAG_ERROR],
		api: API.add_tag(card_id, tag_id),
		payload: { card_id, tag_id }
	};
}
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
	CARDS_REM_TAG_ERROR
} from '../action-types';

export function get_cards(id = shortid() ) {
	return {
		types: [CARDS_GET_CARDS_REQUEST, CARDS_GET_CARDS_SUCCESS, CARDS_GET_CARDS_ERROR],
		api: API.get_cards(),
		payload: { id }
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
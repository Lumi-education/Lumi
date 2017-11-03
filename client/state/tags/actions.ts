import * as shortid from 'shortid';

import {
	TAGS_CREATE_TAG_REQUEST,
	TAGS_CREATE_TAG_SUCCESS,
	TAGS_CREATE_TAG_ERROR,

	TAGS_DELETE_TAG_REQUEST,
	TAGS_DELETE_TAG_SUCCESS,
	TAGS_DELETE_TAG_ERROR,

	TAGS_GET_TAGS_REQUEST,
	TAGS_GET_TAGS_SUCCESS,
	TAGS_GET_TAGS_ERROR
} 				from 'client/state/action-types';

import * as API from './api';

export function create_tag(name: string, description?: string) {
	return {
		types: [TAGS_CREATE_TAG_REQUEST, TAGS_CREATE_TAG_SUCCESS, TAGS_CREATE_TAG_ERROR],
		api: API.create_tag(name, description)
	};
}

export function delete_tag(tag_id: string) {
	return {
		types: [TAGS_DELETE_TAG_REQUEST, TAGS_DELETE_TAG_SUCCESS, TAGS_DELETE_TAG_ERROR],
		api: API.delete_tag( tag_id ),
		payload: { tag_id }
	};
}

export function get_tags() {
	return {
		types: [TAGS_GET_TAGS_REQUEST, TAGS_GET_TAGS_SUCCESS, TAGS_GET_TAGS_ERROR],
		api: API.get_tags()
	};
}

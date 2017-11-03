import * as shortid from 'shortid';

import {
	TAGS_GET_TAGS_REQUEST,
	TAGS_GET_TAGS_SUCCESS,
	TAGS_GET_TAGS_ERROR
} 				from 'client/state/action-types';

import * as API from './api';

export function get_tags() {
	return {
		types: [TAGS_GET_TAGS_REQUEST, TAGS_GET_TAGS_SUCCESS, TAGS_GET_TAGS_ERROR],
		api: API.get_tags()
	};
}

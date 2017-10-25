import * as shortid from 'shortid';

import {
	GROUPS_GET_GROUPS_REQUEST,
	GROUPS_GET_GROUPS_SUCCESS,
	GROUPS_GET_GROUPS_ERROR
} 				from 'client/state/action-types';

import * as API from './api';

export function get_groups() {
	return {
		types: [GROUPS_GET_GROUPS_REQUEST, GROUPS_GET_GROUPS_SUCCESS, GROUPS_GET_GROUPS_ERROR],
		api: API.get_groups()
	};
}
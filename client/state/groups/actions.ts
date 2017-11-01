import * as shortid from 'shortid';

import {
	GROUPS_CREATE_REQUEST,
	GROUPS_CREATE_SUCCESS,
	GROUPS_CREATE_ERROR,

	GROUPS_DELETE_REQUEST,
	GROUPS_DELETE_SUCCESS,
	GROUPS_DELETE_ERROR,

	GROUPS_GET_GROUPS_REQUEST,
	GROUPS_GET_GROUPS_SUCCESS,
	GROUPS_GET_GROUPS_ERROR
} 				from 'client/state/action-types';

import { add_group } 		from 'client/state/users/actions';

import * as API from './api';

export function create_group(name: string) {
	return {
		types: [GROUPS_CREATE_REQUEST, GROUPS_CREATE_SUCCESS, GROUPS_CREATE_ERROR],
		api: API.create_group( name ),
		payload: { payload: { name }}
	};
}

export function delete_group(group_id: string) {
	return {
		types: [GROUPS_DELETE_REQUEST, GROUPS_DELETE_SUCCESS, GROUPS_DELETE_ERROR],
		api: API.delete_group( group_id ),
		payload: { group_id }
	};
}

export function create_and_add_group(user_id: string, group_name: string) {
	return dispatch => {
		API.create_group( group_name )
		.then( res => {
			dispatch({ type: GROUPS_CREATE_SUCCESS, payload: res.body });
			dispatch( add_group(user_id, res.body._id ));
		})
		.catch();
	};
	// return {
	// 	types: [GROUPS_CREATE_AND_ADD_REQUEST, GROUPS_CREATE_AND_ADD_SUCCESS, GROUPS_CREATE_AND_ADD_ERROR],
	// 	api: API.create_group( group_name ),
	// 	payload: { group_name, user_id }
	// };
}

export function get_groups() {
	return {
		types: [GROUPS_GET_GROUPS_REQUEST, GROUPS_GET_GROUPS_SUCCESS, GROUPS_GET_GROUPS_ERROR],
		api: API.get_groups()
	};
}
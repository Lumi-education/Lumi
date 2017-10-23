import * as shortid from 'shortid';

import * as API from './api';

import { IUser } 	from 'lib/types';

import {
	USERS_CREATE_USER_REQUEST,
	USERS_CREATE_USER_SUCCESS,
	USERS_CREATE_USER_ERROR,

	USERS_GET_USERS_REQUEST,
	USERS_GET_USERS_SUCCESS,
	USERS_GET_USERS_ERROR,

	USERS_GET_USER_REQUEST,
	USERS_GET_USER_SUCCESS,
	USERS_GET_USER_ERROR,

	USERS_DELETE_USER_REQUEST,
	USERS_DELETE_USER_SUCCESS,
	USERS_DELETE_USER_ERROR
} from '../action-types';

export function create_user(user: IUser, id = shortid() ) {
	return {
		types: [USERS_CREATE_USER_REQUEST, USERS_CREATE_USER_SUCCESS, USERS_CREATE_USER_ERROR],
		api: API.create_user( user ),
		payload: { id, payload: { user } }
	};
}

export function get_users(id = shortid() ) {
	return {
		types: [USERS_GET_USERS_REQUEST, USERS_GET_USERS_SUCCESS, USERS_GET_USERS_ERROR],
		api: API.get_users(),
		payload: { id }
	};
}

export function get_user(user_id: string, id = shortid() ) {
	return {
		types: [USERS_GET_USER_REQUEST, USERS_GET_USER_SUCCESS, USERS_GET_USER_ERROR],
		api: API.get_user( user_id ),
		payload: { id, payload: { user_id } }
	};
}

export function delete_user(user_id: string, id = shortid() ) {
	return {
		types: [USERS_DELETE_USER_REQUEST, USERS_DELETE_USER_SUCCESS, USERS_DELETE_USER_ERROR],
		api: API.delete_user( user_id ),
		payload: { id, payload: { user_id } }
	};
}
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
} from '../action-types';

import * as types	from '../action-types';

export function create_data( data ) {
	return {
		types: [DATA_CREATE_REQUEST, DATA_CREATE_SUCCESS, DATA_CREATE_ERROR],
		api: API.create_data( data ),
		payload: { data }
	};
}

export function get_data( query ) {
	return {
		types: [DATA_GET_REQUEST, DATA_GET_SUCCESS, DATA_GET_ERROR],
		api: API.get_data( query ),
		payload: { query }
	};
}

export function update_data( data ) {
	return {
		types: [DATA_UPDATE_REQUEST, DATA_UPDATE_SUCCESS, DATA_UPDATE_ERROR],
		api: API.update_data( data ),
		payload: { data }
	};
}
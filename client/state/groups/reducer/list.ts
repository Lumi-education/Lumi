import {
	assign,
	unionBy,
}				from 'lodash';

import { Map } from 'immutable';

import { 
	IGroup 
} 							from 'lib/types';

import { arrayToObject } 	from 'client/utils';

import { 
	USERS_GET_USERS_SUCCESS,
	USERS_GET_USER_SUCCESS,
	GROUPS_GET_GROUPS_SUCCESS,
	GROUPS_CREATE_SUCCESS
} 							from 'client/state/action-types';

export default function(state: Map<string, IGroup> = Map<string, IGroup>({}), action): Map<string, IGroup> {
	switch (action.type) {

		case USERS_GET_USERS_SUCCESS:
		case USERS_GET_USER_SUCCESS:
		case GROUPS_GET_GROUPS_SUCCESS:
			return state.merge( Map<string, IGroup>( arrayToObject(action.payload.groups) ) );

		case GROUPS_CREATE_SUCCESS:
			let o = {};
			o[ action.payload._id ] = action.payload;
			return state.merge( Map<string, IGroup>( o ) );

		default:
			return state;
	}

}

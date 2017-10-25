import {
	assign,
	unionBy,
}				from 'lodash';

import { IUser } 			from 'lib/types';

import { 
	USERS_ADD_GROUP_REQUEST,
	USERS_REM_GROUP_REQUEST,
	USERS_CREATE_USER_SUCCESS,
	USERS_GET_USERS_SUCCESS,
	USERS_GET_USER_SUCCESS,
	USERS_DELETE_USER_REQUEST
} 							from 'client/state/action-types';

export default function(state: Array<IUser> = [], action): Array<IUser> {
	switch (action.type) {

		case USERS_ADD_GROUP_REQUEST:
			return state.map(
				u => u._id === action.payload.user_id 
				? 
				add_group(u, action.payload.group_id)
				: 
				u
			);	

		case USERS_REM_GROUP_REQUEST:
			return state.map(
				u => u._id === action.payload.user_id 
				? 
				rem_group(u, action.payload.group_id)
				: 
				u
			);		

		case USERS_CREATE_USER_SUCCESS:
			return [ ...state, action.payload ];

		case USERS_GET_USER_SUCCESS:
			return unionBy( [action.payload.user ], state, '_id' );

		case USERS_GET_USERS_SUCCESS:
			return unionBy( action.payload.users, state, '_id');

		case USERS_DELETE_USER_REQUEST:
			return state.filter(u => u._id !== action.payload.user_id);

		default:
			return state;
	}

}

export function add_group(user: IUser, group_id: string) {
	return assign({}, user, { groups: [ ...user.groups, group_id ]});
}

export function rem_group(user: IUser, group_id: string) {
	return assign({}, user, { groups: user.groups.filter(g => g !== group_id)});
}
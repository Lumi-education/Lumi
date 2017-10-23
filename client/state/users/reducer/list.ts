import {
	assign,
	unionBy,
}				from 'lodash';

import { IUser } 			from 'lib/types';

import { 
	USERS_CREATE_USER_SUCCESS,
	USERS_GET_USERS_SUCCESS,
	USERS_GET_USER_SUCCESS,
	USERS_DELETE_USER_REQUEST
} 							from 'client/state/action-types';

export default function(state: Array<IUser> = [], action): Array<IUser> {
	switch (action.type) {

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

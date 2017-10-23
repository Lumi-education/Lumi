import {
	assign,
	unionBy,
}				from 'lodash';

import { IGroup } 			from 'lib/types';

import { 
	USERS_GET_USERS_SUCCESS,
	USERS_GET_USER_SUCCESS
} 							from 'client/state/action-types';

export default function(state: Array<IGroup> = [], action): Array<IGroup> {
	switch (action.type) {

		case USERS_GET_USERS_SUCCESS:
		case USERS_GET_USER_SUCCESS:
			return unionBy( action.payload.groups, state, '_id');

		default:
			return state;
	}

}

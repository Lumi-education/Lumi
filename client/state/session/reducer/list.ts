import { 
	assign,
	unionBy
}				from 'lodash';

import { Session } 			from '../types';

import {
	USER_INIT_SUCCESS
}								from '../../action-types';

export default function(state: Array<Session> = [], action): Array<Session> {
	switch ( action.type ) {

		case USER_INIT_SUCCESS:
			return unionBy( action.payload.filter(d => d.type === 'session'), state, '_id');

		default:
			return state;
	}
	
}
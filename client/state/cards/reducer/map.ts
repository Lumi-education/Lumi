import { Map } 				from 'immutable';
import { ICard } 			from 'lib/types';

import {
	arrayToObject
} 							from 'client/utils';

import { 
	CARDS_GET_CARDS_SUCCESS,
	CARDS_REM_TAG_SUCCESS,
	CARDS_ADD_TAG_SUCCESS
} 							from 'client/state/action-types';

export default function(state: Map<string, ICard> = Map<string, ICard>({}), action): Map<string, ICard> {
	switch (action.type) {

		case CARDS_GET_CARDS_SUCCESS:
			return state.merge( Map<string, ICard>( arrayToObject(action.payload.cards) ) );

		case CARDS_REM_TAG_SUCCESS:
		case CARDS_ADD_TAG_SUCCESS:
			let o = {};
			o[ action.payload._id ] = action.payload;
			return state.merge( Map<string, ICard>( o ) );

		default:
			return state;
	}

}

// export function add_group(user: IUser, group_id: string) {
// 	return assign({}, user, { groups: [ ...user.groups, group_id ]});
// }

// export function rem_group(user: IUser, group_id: string) {
// 	return assign({}, user, { groups: user.groups.filter(g => g !== group_id)});
// }
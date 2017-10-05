import {
	assign,
	unionBy,
 } 		from 'lodash';

import { CollectionMeta }						from '../types';

import { 
	COLLECTION_CREATEMETA_REQUEST,	
	COLLECTION_CREATEMETA_SUCCESS,
	USER_INIT_SUCCESS
} 												from '../../action-types';

const initialState: CollectionMeta[] = [];

export default function(state: CollectionMeta[] = initialState, action): CollectionMeta[] {

	switch (action.type) {

		case COLLECTION_CREATEMETA_SUCCESS:
			return state.map(c => c._id === action.id ? action.payload : c); // unionBy([action.payload], state, '_id' );

		case COLLECTION_CREATEMETA_REQUEST:
			return [ ...state, {
				_id: action.id,
				user_id: undefined,
				collection_id: action.collection_id,
				submitted: false,
				type: 'collection_meta'
			}];

		case USER_INIT_SUCCESS:		
			return unionBy( action.payload.filter(d => d.type === 'collection_meta'), state, '_id' );
			
		default:
			return state;
	}

}

import {
	assign,
	unionBy,
 } 		from 'lodash';

import { CollectionMeta }						from '../types';

import { 
	COLLECTION_CREATEMETA_SUCCESS,
	USER_INIT_SUCCESS
} 												from '../../action-types';

const initialState: CollectionMeta[] = [];

export default function(state: CollectionMeta[] = initialState, action): CollectionMeta[] {

	switch (action.type) {

		case COLLECTION_CREATEMETA_SUCCESS:
			return unionBy([action.payload], state, '_id' );
		
		case USER_INIT_SUCCESS:		
			return unionBy( action.payload.filter(d => d.type === 'collection_meta'), state, '_id' );
			
		default:
			return state;
	}

}

import {
	assign,
	unionBy,
 } 		from 'lodash';

import { Collection }						from '../types';

import {
	COLLECTION_GET_SUCCESS
} from '../../action-types';

const initialState: Collection[] = [];

export default function(state: Collection[] = initialState, action): Collection[] {

	switch (action.type) {

		case COLLECTION_GET_SUCCESS:
			return unionBy(action.payload.filter((d) => d.type === 'collection') , state, '_id');

		default:
			return state;
	}

}

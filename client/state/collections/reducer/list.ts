import {
	assign,
	unionBy,
} 						from 'lodash';

import {
	COLLECTION_GET_SUCCESS
} 						from '../../action-types';

import {
	ICollection
}						from 'lib/types';

const initialState: Array<ICollection> = [];

export default function(state: Array<ICollection> = initialState, action): Array<ICollection> {

	switch (action.type) {

		case COLLECTION_GET_SUCCESS:
			return unionBy(action.payload.collections, state, '_id');

		default:
			return state;
	}

}

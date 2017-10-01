import {
	assign,
	unionBy,
 } 		from 'lodash';

import { CollectionMeta }						from '../types';

const initialState: CollectionMeta[] = [];

export default function(state: CollectionMeta[] = initialState, action): CollectionMeta[] {

	switch (action.type) {
		default:
			return state;
	}

}

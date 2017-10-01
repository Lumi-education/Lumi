import {
	assign,
	unionBy,
}				from 'lodash';

import { Material } 			from '../types';

import { COLLECTION_GET_SUCCESS } from '../../action-types';

export default function(state: Material[] = [], action): Material[] {
	switch (action.type) {

		case COLLECTION_GET_SUCCESS:
			return unionBy(action.payload.body.filter((d) => d.type === 'material'), state, '_id');

		default:
			return state;
	}

}

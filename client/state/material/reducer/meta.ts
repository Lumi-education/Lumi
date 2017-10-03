import {
	assign,
	unionBy,
 } 		from 'lodash';

import { MaterialMeta }						from '../types';

import {
	MATERIAL_CREATE_META_REQUEST,
	MATERIAL_CREATE_META_SUCCESS
}			from '../../action-types';

const initialState: MaterialMeta[] = [];

export default function material_meta(state: MaterialMeta[] = initialState, action): MaterialMeta[] {

	switch (action.type) {

		case MATERIAL_CREATE_META_REQUEST:
			return [ ...state, assign({}, action.payload, { _id: action.id }) ];

		case MATERIAL_CREATE_META_SUCCESS:
			return state.map(m => 
				m._id === action.id ? assign({}, m, { _id: action.payload.id, _rev: action.payload.rev }) : m
			);
		default:
			return state;
	}

}

import {
	assign,
	unionBy,
} 		from 'lodash';

import { MaterialMeta }						from '../types';

import {
	MATERIAL_CREATE_META_REQUEST,
	MATERIAL_CREATE_META_SUCCESS,
	MATERIAL_UPDATE_META_REQUEST,
	USER_INIT_SUCCESS
}			from '../../action-types';

const initialState: MaterialMeta[] = [];

export default function material_meta(state: MaterialMeta[] = initialState, action): MaterialMeta[] {

	switch (action.type) {

		case MATERIAL_CREATE_META_REQUEST:
			return [ ...state, assign({}, action.payload, { _id: action.id }) ];

		case MATERIAL_UPDATE_META_REQUEST:
			return state.map(m => m._id === action.payload.material_meta_id ? assign({}, m, action.payload.update) : m);

		case USER_INIT_SUCCESS:		
			return unionBy( action.payload.filter(d => d.type === 'material_meta'), state, '_id' );

		case MATERIAL_CREATE_META_SUCCESS:
			return state.map(m => 
				m._id === action.id ? assign({}, m, { _id: action.payload.id, _rev: action.payload.rev }) : m
			);
		default:
			return state;
	}

}

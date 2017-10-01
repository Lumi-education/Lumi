import {
	assign,
	unionBy,
 } 		from 'lodash';

import { MaterialMeta }						from '../types';

const initialState: MaterialMeta[] = [];

export default function material_meta(state: MaterialMeta[] = initialState, action): MaterialMeta[] {

	switch (action.type) {
		default:
			return state;
	}

}

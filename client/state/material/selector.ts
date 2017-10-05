import { isEqual } 		from 'lodash';

import { State } 		from '../';

import { 
	Material as PMaterial,
	MaterialMeta
 } from './types';

export interface Material extends PMaterial {
	meta: MaterialMeta;
}

export function get_material(state: State, id: string, query): Material {
	const _material = state.material.list.filter(m => m._id === id)[0];

	try {
		return {
			..._material,
			meta: state.material.meta.filter(meta => meta.material_id === _material._id && isEqual(meta.query, query) )[0]
		};
	} catch (err) {
		return {
			..._material,
			meta: undefined
		};
	}
	
}
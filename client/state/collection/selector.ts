import { State }		from '../';
import { Collection as PCollection } 	from './types';
import { Material } 	from '../material/types';

import { material_with_meta } from '../material/selector';

export interface Collection extends PCollection {
	material_list: Array<Material>;
}

export function collection_list(state: State): Array<Collection> {
	return state.collection.list.map(c => collection(state, c._id) );
}

export function collection(state: State, id: string): Collection {
	const _collection = state.collection.list.filter(c => c._id === id)[0];

	return {
		..._collection,
		material_list: _collection.material
		.map(m_id => material_with_meta(state, m_id, { collection: _collection._id, type: 'worksheet' }) )
	};
}
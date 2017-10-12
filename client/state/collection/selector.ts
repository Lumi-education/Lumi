import { State }		from '../';
import { 
	Collection as PCollection,
	CollectionMeta
} 						from './types';
import { 
	Material,
	get_material 
} from '../material/selector';

export interface Collection extends PCollection {
	material_list: Array<Material>;
	meta: CollectionMeta;
}

export function get_collection_list(state: State): Array<Collection> {
	return state.collection.list.map(c => get_collection(state, c._id) );
}

export function get_collection_meta(state: State, collection_id: string): CollectionMeta {
	return state.collection.meta.filter(c => c.collection_id === collection_id)[0];
}

export function get_collection(state: State, collection_id: string): Collection {
	const _collection = state.collection.list.filter(c => c._id === collection_id)[0];

	try {
		return {
			..._collection,
			material_list: _collection.material
			.map(m_id => get_material(state, m_id, { collection: _collection._id, type: 'worksheet' }) ),
			meta: get_collection_meta(state, collection_id)
		};
	} catch (err) {
		return {
			..._collection,
			material_list: [],
			meta: get_collection_meta(state, collection_id)
		};
	}
	
}
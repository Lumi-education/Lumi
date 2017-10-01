export interface State {
	collection: {
		list: Array<Collection>;
		meta: Array<CollectionMeta>;
	}
}
export interface Collection {
	_id: string;
	name: string;
	description: string;
	type: 'collection';
	material: Array<string>;
	tag_list: Array<string>;
}

export interface CollectionMeta {
	_id: string;
	user_id: string;
	collection_id: string;
	submitted: boolean;
	type: 'collection_meta';
}
export interface ICollection {
	_id: string;
	name: string;
	description: string;
	type: 'collection';
	material: Array<string>;
	tag_list: Array<string>;
}
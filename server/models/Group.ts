import { assign } 		from 'lodash';
import { 
	IGroup,
	Collection_id
} 	from 'lib/types';

import Collection 		from './Collection';

import { DB, Relations } from 		'../db';

export default class Group extends Relations implements IGroup {
	public _id: string;
	public type: 'group';
	public name: string;
	public assigned_collections: Array<Collection_id>;
	
	constructor(t?: Group) {
		super();
		if (t) {
			return assign(
				this, 
				{
					type: 'group',
					name: 'new Group'
				},
				t);
		} else {
			this._id = undefined;
			this.type = 'group';
			return this;
		}
	}

	public set_name(name: string): void { this.name = name; }

	public get_collections(db: DB, cb: (collections: Array<Collection>) => void) {
		this.hasMany(db, this.assigned_collections, cb, Collection);
	}

}
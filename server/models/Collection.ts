import { assign } 		from 'lodash';
import { ICollection } 	from '../../types';

export default class Collection implements ICollection {
	public _id: string;
	public description: string;
	public type: 'collection';
	public material: Array<string>;
	public tag_list: Array<string>;
	public name: string;
	
	constructor(c?: Collection) {
		if (c) {
			return assign(this, c);
		} else {
			this._id = undefined;
			this.type = 'collection';
		}
	}

	public set_name(name: string): void { this.name = name; }

	public add_material(material_id: string): void { 
		this.material.push( material_id );
	}
}
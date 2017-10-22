import { assign } 		from 'lodash';
import { 
	ITag
} 	from 'lib/types';

import { DB, Relations } from 		'../db';

export default class Tag extends Relations implements ITag {
	public _id: string;
	public type: 'tag';
	public name: string;
	
	constructor(t?: Tag) {
		super();
		if (t) {
			return assign(
				this, 
				{
					type: 'tag',
					name: 'new Tag'
				},
				t);
		} else {
			this._id = undefined;
			this.type = 'tag';
			return this;
		}
	}

	public set_name(name: string): void { this.name = name; }

}
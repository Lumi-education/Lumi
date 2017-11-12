import { assign } 		from 'lodash';
import { 
	IData
} 	from 'lib/types';

import { DB, Relations } from 		'../db';

export default class Data extends Relations implements IData {
	public _id: string;
	public type: 'data';
	
	constructor(c?) {
		super();
		return assign(
			this, 
			{
				type: 'data'
			},
			c);
	}
}
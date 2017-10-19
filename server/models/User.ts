import { assign } 		from 'lodash';
import { 
	IUser,
	Group_id
} 	from '../../types';

import  Group 	from './Group';

import { DB, Relations } from 		'../db';

export default class User extends Relations implements IUser {
	public _id: string;
	public type: 'user';
	public name: string;
	public level: number;
	public groups: Array<Group_id>;
	
	constructor(u?: User) {
		super();
		return assign(
			this, 
			{
				type: 'user',
				level: 1,
				name: 'new user',
				groups: []
			},
			u
		);
	}

	public set_name(name: string): void { this.name = name; }

	public get_groups(db: DB, cb: (tags: Array<Group>) => void): void {
		this.hasMany(db, this.groups, cb, Group);
	}

}
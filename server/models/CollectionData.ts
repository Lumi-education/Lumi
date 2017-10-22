import { assign } 		from 'lodash';
import { 
	ICollectionData,
	Card_id,
	Collection_id,
	User_id
} 	from 'lib/types';

import Card 			from './Card';
import Collection 				from './Collection';
import User 					from './User';
import { DB, Relations } from 		'../db';

export default class CollectionData extends Relations implements ICollectionData {
	public _id: string;
	public type: 'collectiondata';
	public collection_id: Collection_id;
	public user_id: User_id;
	public completed: boolean;
	
	constructor(c?: CollectionData) {
		super();
		return assign(
			this, 
			{
				type: 'collectiondata',
				completed: false
			},
			c);
	}

	public get_collection(db: DB, cb: (collection: Collection) => void) {
		this.hasOne(db, this.collection_id, cb, Collection);
	}

	public get_user(db: DB, cb: (user: User) => void) {
		this.hasOne(db, this.user_id, cb, User);
	}

}
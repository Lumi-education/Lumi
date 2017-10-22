import { assign } 		from 'lodash';
import { 
	ICardData,
	Card_id,
	Collection_id,
	User_id
} 	from 'lib/types';

import Card 			from './Card';
import Collection 				from './Collection';
import User 					from './User';
import { DB, Relations } from 		'../db';

export default class CardData extends Relations implements ICardData {
	public _id: string;
	public type: 'carddata';
	public collection_id: Collection_id;
	public card_id: Card_id;
	public user_id: User_id;
	public data: Array<string>;
	public score: number;
	public hints: number;
	public completed: boolean;
	
	constructor(c?: CardData) {
		super();
		return assign(
			this, 
			{
				type: 'carddata',
				completed: false,
				score: 0,
				hints: 0
			},
			c);
	}

	public get_card(db: DB, cb: (card: Card) => void): void {
		this.hasOne(db, this.card_id, cb, Card);
	}

	public get_collection(db: DB, cb: (collection: Collection) => void) {
		this.hasOne(db, this.collection_id, cb, Collection);
	}

	public get_user(db: DB, cb: (user: User) => void) {
		this.hasOne(db, this.user_id, cb, User);
	}

}
import { assign } 		from 'lodash';
import { 
	ICard,
	Card_id,
	Card_types,
	Tag_id,
	Markdown,
	ITag
} 	from '../../types';

import  Tag 	from './Tag';

import { DB, Relations } from 		'../db';

export default class Card extends Relations implements ICard {
	public _id: string;
	public type: 'card';
	public card_type: Card_types;
	public tags: Array<Tag_id>;
	public name: string;
	public task: Markdown;
	public items: Array<Markdown>;
	public hints: Array<Markdown>;
	public url: string;
	public _attachments;
	
	constructor(c?: Card) {
		super();
		return assign(
			this, 
			{
				type: 'card',
				tags: [],
				name: 'new card',
				items: [],
				hints: []
			},
			c
		);
	}

	public set_name(name: string): void { this.name = name; }

	public get_tags(db: DB, cb: (tags: Array<Tag>) => void): void {
		this.hasMany(db, this.tags, cb, Tag);
	}

}
type Card_id = string;
type Collection_id = string;
type Data_id = string;
type Tag_id = string;
type User_id = string;
type Group_id = string;
type Markdown = string;
type Session_id = string;
type Card_types = 'multiplechoice' | 'freetext' | 'text' | 'sort' | 'video';

export interface ICollection {
	_id: Collection_id;
	type: 'collection';	
	name: string;
	description: string;
	cards: Array<Card_id>;
	tags: Array<Tag_id>;
	created_at: Date;
}

export interface ITag {
	_id: Tag_id;
	type: 'tag';
	name: string;
}

export interface ICard {
	_id: Card_id;
	type: 'card';
	card_type: Card_types;
	tags: Array<Tag_id>;
	name: string;
	task: Markdown;
	items: Array<Markdown>;
	hints: Array<Markdown>;
	url: string;
	_attachments;	
}

export interface IUser {
	_id: User_id;
	type: 'user';
	name: string;
	level: number;
	groups: Array<Group_id>;
}

export interface IData {
	_id: Data_id;
	user_id: User_id;
}

export interface ICardData extends IData {
	type: string;
	collection_id: Collection_id;
	card_id: Card_id;
	completed: boolean;
	data: Array<Markdown>;
	score: number;
	hints: number;
}

export interface ICollectionData extends IData {
	// type: 'collectiondata';
	collection_id: Collection_id;
	completed: boolean;
}

export interface IGroup {
	_id: Group_id;
	type: 'group';
	name: string;
	assigned_collections: Array<Collection_id>;
}

export interface ISession {
	_id: Session_id;
	type: 'session';
	user_id: User_id;
	online: boolean;
}

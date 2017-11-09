import { assign } from 'lodash';
import {
    ICard,
    IUser,
    Card_id,
    Card_types,
    Tag_id,
    Markdown,
    ITag
} from 'lib/types';

import Tag from './Tag';

import { DB, Relations } from '../db';

export default class Card extends Relations implements ICard {
    public _id: string;
    public type: 'card';
    public card_type: Card_types;
    public tags: Array<Tag_id>;
    public name: string;
    public text: Markdown;
    public description: string;
    public items: Array<Markdown>;
    public hints: Array<Markdown>;
    public url: string;
    public created_at: Date;
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
                hints: [],
                created_at: new Date(),
                description: ''
            },
            c
        );
    }

    public set_name(name: string): void {
        this.name = name;
    }

    public add_tag(tag_id: string): void {
        this.tags.push(tag_id);
    }

    public rem_tag(tag_id: string): void {
        this.tags = this.tags.filter(tag => tag !== tag_id);
    }

    public get_tags(db: DB, cb: (tags: Array<Tag>) => void): void {
        this.hasMany(db, this.tags, cb, Tag);
    }
}

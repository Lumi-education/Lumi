import { assign } from 'lodash';
import { ICollection, Card_id, Tag_id } from 'lib/types';

import Card from './Card';
import Tag from './Tag';
import { DB, Relations } from '../db';

export default class Collection extends Relations implements ICollection {
    public _id: string;
    public description: string;
    public type: 'collection';
    public cards: Array<Card_id>;
    public tags: Array<Tag_id>;
    public name: string;
    public created_at: Date;

    constructor(c?: Collection) {
        super();
        return assign(
            this,
            {
                type: 'collection',
                description: '',
                cards: [],
                tags: [],
                name: 'new collection',
                created_at: new Date()
            },
            c
        );
    }

    public set_name(name: string): void {
        this.name = name;
    }

    public add_card(card_id: string): void {
        this.cards.push(card_id);
    }

    public get_cards(db: DB, cb: (cards: Array<Card>) => void): void {
        this.hasMany(db, this.cards, cb, Card);
    }

    public get_tags(db: DB, cb: (tags: Array<Tag>) => void) {
        this.hasMany(db, this.tags, cb, Tag);
    }
}

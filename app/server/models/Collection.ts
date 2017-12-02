import { assign, uniq } from 'lodash';
import { ICollection, Card_id } from 'common/types';

import Card from './Card';
import Tag from './Tag';
import { DB } from '../db';
import Relations from '../db/relations';

export default class Collection extends Relations implements ICollection {
    public _id: string;
    public description: string;
    public type: 'collection';
    public cards: Card_id[];
    public name: string;
    public created_at: Date;
    public updated_at: Date;

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

    public add_cards(card_ids: string[]): void {
        this.cards = uniq([...this.cards, ...card_ids]);
    }

    public rem_cards(card_ids: string[]): void {
        this.cards = this.cards.filter(id => card_ids.indexOf(id) > -1);
    }

    public get_cards(db: DB, cb: (cards: Card[]) => void): void {
        this.hasMany(db, this.cards, cb, Card);
    }
}

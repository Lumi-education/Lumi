import { assign } from 'lodash';
import { ICard, IUser, Card_id, Card_types, Markdown } from 'common/types';

import Tag from './Tag';

import { DB } from '../db';
import Relations from '../db/relations';

export default class Card extends Relations implements ICard {
    public _id: string;
    public type: 'card';
    public card_type: Card_types;
    public name: string;
    public text: Markdown;
    public description: string;
    public items: Markdown[];
    public hints: Markdown[];
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
}

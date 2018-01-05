import { assign } from 'lodash';
import { IBaseCard } from 'lib/cards/types';

type Markdown = string;

export default class Card implements IBaseCard {
    public _id: string;
    public type: 'card';
    public card_type: string;
    public name: string;
    public text: Markdown;
    public description: string;
    public items: Markdown[];
    public hints: Markdown[];
    public url: string;
    public created_at: Date;
    public _attachments;

    constructor(c?: Card) {
        return assign(
            this,
            {
                type: 'card',
                card_type: 'multiplechoice',
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

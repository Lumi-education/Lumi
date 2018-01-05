import { assign, uniq } from 'lodash';
import { ICollection, ICollectionSubmitMsg } from 'lib/collections/types';

export default class Collection implements ICollection {
    public _id: string;
    public description: string;
    public type: 'collection';
    public cards: string[];
    public name: string;
    public created_at: Date;
    public updated_at: Date;
    public submit_messages: ICollectionSubmitMsg[];

    constructor(c?: Collection) {
        return assign(
            this,
            {
                type: 'collection',
                description: '',
                cards: [],
                tags: [],
                name: 'new collection',
                created_at: new Date(),
                submit_messages: []
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
}

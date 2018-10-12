import { filter, intersection } from 'lodash';
import { ICard, IState, ICardData, IData, IFreetextCard } from './types';

export function select_all_cards(state: IState): ICard[] {
    return state.cards.list;
}

export function select_cards_by_ids(
    state: IState,
    card_ids: string[] = []
): ICard[] {
    return card_ids.map(card_id => select_card(state, card_id));
}

export function select_card(state: IState, card_id: string): ICard {
    return (
        state.cards.list.filter(card => card._id === card_id)[0] || {
            _id: undefined,
            type: 'card',
            card_type: undefined,
            video_url: '',
            name: 'card ' + card_id + ' not found',
            text: 'card ' + card_id + ' not found',
            _rev: undefined,
            items: [],
            files: [],
            description: '',
            created_at: new Date(),
            tags: [],
            _attachments: {}
        }
    );
}

export function name(state: IState, _id: string): string {
    return select_card(state, _id).name;
}

export function with_tags(state: IState, tag_ids: string[]): ICard[] {
    return state.cards.list.filter(
        card => intersection(card.tags, tag_ids).length === tag_ids.length
    );
}

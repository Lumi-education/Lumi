import { Map } from 'immutable';
import { IState } from 'client/state';

import { ICard } from './types';
import { IFreetextCard } from 'client/packages/cards/types';

// type Card = ICard | IFreetextCard;

export function select_all_cards(state: IState): ICard[] {
    return state.cards.map.toArray();
}

export function select_cards_as_map(state: IState): Map<string, ICard> {
    return state.cards.map;
}

export function select_cards_by_ids(
    state: IState,
    card_ids: string[] = []
): ICard[] {
    return card_ids.map(card_id => select_card(state, card_id));
}

export function select_card(state: IState, card_id: string): ICard {
    return state.cards.map.get(card_id, {
        _id: undefined,
        type: 'card',
        card_type: undefined,
        video_url: '',
        name: 'card not found',
        text: 'card not found',
        items: [],
        description: '',
        created_at: new Date(),
        _attachments: {}
    });
}

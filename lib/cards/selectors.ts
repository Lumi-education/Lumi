import { Map } from 'immutable';
import { filter } from 'lodash';
import { ICard, IState, ICardData, IData, IFreetextCard } from './types';

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
        _rev: undefined,
        items: [],
        description: '',
        created_at: new Date(),
        _attachments: {}
    });
}

export function data_query(state: IState, _query): ICardData[] {
    return filter(state.cards.data.toArray(), _query);
}

export function name(state: IState, _id: string): string {
    return select_card(state, _id).name;
}

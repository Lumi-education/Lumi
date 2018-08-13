import { assign, unionBy } from 'lodash';

import { CARD_SELECT, CARD_SELECTION_RESET } from '../constants';

import { CARDS_UI_CHANGE_CARD, CARDS_UI_RESET_CARD } from '../actions';

import { ICardUI } from '..';

import * as Core from 'lib/core';

const initialState: ICardUI = {
    selected_cards: [],
    card: { card_type: 'multiplechoice' }
};

export default function(state: ICardUI = initialState, action): ICardUI {
    switch (action.type) {
        case CARD_SELECT:
            if (state.selected_cards.indexOf(action.payload.card_id) > -1) {
                return assign({}, state, {
                    selected_cards: state.selected_cards.filter(
                        c => c !== action.payload.card_id
                    )
                });
            }
            return assign({}, state, {
                selected_cards: [
                    ...state.selected_cards,
                    action.payload.card_id
                ]
            });

        case CARD_SELECTION_RESET:
            return assign({}, state, { selected_cards: [] });

        case CARDS_UI_CHANGE_CARD:
            const new_card = assign({}, state.card, action.payload);
            return assign({}, state, { card: new_card });

        case CARDS_UI_RESET_CARD:
            return assign({}, state, {
                card: { card_type: Core.config.default_card_type }
            });

        default:
            return state;
    }
}

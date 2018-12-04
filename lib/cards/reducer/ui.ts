import { assign, uniq } from 'lodash';

import {
    CARDS_UI_CHANGE_CARD,
    CARDS_UI_RESET_CARD,
    CARDS_UI_SET_SELECTED_CARDS,
    CARD_SELECT,
    CARD_SELECTION_RESET,
    CARDS_ADD_CARD_TO_SELECTION,
    CARDS_REMOVE_CARD_FROM_SELECTION
} from '../actions';

import { ICardUI } from '..';

import * as Core from 'lib/core';

const initialState: ICardUI = {
    selected_cards: [],
    card: {
        _id: 'new_card',
        card_type: Core.config.default_card_type,
        files: []
    }
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

        case CARDS_ADD_CARD_TO_SELECTION:
            const index =
                action.index !== undefined
                    ? action.index
                    : state.selected_cards.length;
            return assign({}, state, {
                selected_cards: uniq([
                    ...state.selected_cards.slice(0, index),
                    action.card_id,
                    ...state.selected_cards.slice(index)
                ]).filter(card_id => card_id !== 'no_id' && card_id !== null)
            });

        case CARDS_REMOVE_CARD_FROM_SELECTION:
            return assign({}, state, {
                selected_cards: state.selected_cards.filter(
                    card_id => card_id !== action.card_id
                )
            });

        case CARDS_UI_SET_SELECTED_CARDS:
            return assign({}, state, {
                selected_cards: action.card_ids.filter(
                    card_id => card_id !== 'no_id' && card_id !== null
                )
            });

        case CARDS_UI_CHANGE_CARD:
            const new_card = assign({}, state.card, action.payload);
            return assign({}, state, { card: new_card });

        case CARDS_UI_RESET_CARD:
            return assign({}, state, {
                card: initialState.card
            });

        default:
            return state;
    }
}

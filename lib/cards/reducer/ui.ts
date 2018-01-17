import { assign, unionBy } from 'lodash';

import { CARD_SELECT, CARD_SELECTION_RESET } from '../constants';

import { ICardUI } from '../';

const initialState: ICardUI = {
    selected_cards: []
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

        default:
            return state;
    }
}

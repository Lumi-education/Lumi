import { Map } from 'immutable';
import { ICard } from '../types';

import { arrayToObject } from 'lib/core/utils';

import {
    CARDS_GET_CARDS_SUCCESS,
    CARDS_REM_TAG_SUCCESS,
    CARDS_ADD_TAG_SUCCESS,
    CARDS_UPDATE_CARD_SUCCESS,
    CARDS_DELETE_CARD_SUCCESS,
    CARDS_GET_CARD_SUCCESS,
    CARDS_CREATE_CARD_SUCCESS
} from '../constants';

export default function(
    state: Map<string, ICard> = Map<string, ICard>({}),
    action
): Map<string, ICard> {
    switch (action.type) {
        case CARDS_REM_TAG_SUCCESS:
        case CARDS_ADD_TAG_SUCCESS:
        case CARDS_UPDATE_CARD_SUCCESS:
        case CARDS_CREATE_CARD_SUCCESS:
            const o = {};
            o[action.payload._id] = action.payload;
            return state.merge(Map<string, ICard>(o));

        case CARDS_DELETE_CARD_SUCCESS:
            return state.delete(action.card_id);

        case 'DB_CHANGE':
        case CARDS_GET_CARDS_SUCCESS:
        case CARDS_GET_CARD_SUCCESS:
            return state.merge(
                Map<string, ICard>(
                    arrayToObject(action.payload.filter(d => d.type === 'card'))
                )
            );

        default:
            return state;
    }
}

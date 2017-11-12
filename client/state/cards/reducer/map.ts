import { Map } from 'immutable';
import { ICard } from 'lib/types';

import { arrayToObject } from 'client/utils';

import {
    CARDS_GET_CARDS_SUCCESS,
    CARDS_REM_TAG_SUCCESS,
    CARDS_ADD_TAG_SUCCESS,
    CARDS_UPDATE_CARD_SUCCESS,
    CARDS_DELETE_CARD_SUCCESS,
    CARDS_GET_CARD_SUCCESS,
    CARDS_CREATE_CARD_SUCCESS,
    COLLECTION_GET_SUCCESS,
    DB_CHANGE
} from 'client/state/action-types';

export default function(
    state: Map<string, ICard> = Map<string, ICard>({}),
    action
): Map<string, ICard> {
    switch (action.type) {
        case CARDS_GET_CARDS_SUCCESS:
        case CARDS_GET_CARD_SUCCESS:
        case COLLECTION_GET_SUCCESS:
            return state.merge(
                Map<string, ICard>(arrayToObject(action.payload.cards))
            );

        case CARDS_REM_TAG_SUCCESS:
        case CARDS_ADD_TAG_SUCCESS:
        case CARDS_UPDATE_CARD_SUCCESS:
        case CARDS_CREATE_CARD_SUCCESS:
            let o = {};
            o[action.payload._id] = action.payload;
            return state.merge(Map<string, ICard>(o));

        case CARDS_DELETE_CARD_SUCCESS:
            return state.delete(action.card_id);

        case DB_CHANGE:
            return state.merge(
                Map<string, ICard>(
                    arrayToObject(action.payload.filter(d => d.type === 'card'))
                )
            );

        default:
            return state;
    }
}

// export function add_group(user: IUser, group_id: string) {
// 	return assign({}, user, { groups: [ ...user.groups, group_id ]});
// }

// export function rem_group(user: IUser, group_id: string) {
// 	return assign({}, user, { groups: user.groups.filter(g => g !== group_id)});
// }

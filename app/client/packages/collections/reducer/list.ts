import { assign, unionBy } from 'lodash';

import {
    COLLECTION_GET_SUCCESS,
    GROUPS_GET_GROUP_SUCCESS,
    COLLECTION_ADD_CARDS_REQUEST,
    DB_CHANGE
} from '../../action-types';

import { ICollection } from 'common/types';

const initialState: ICollection[] = [];

export default function(
    state: ICollection[] = initialState,
    action
): ICollection[] {
    switch (action.type) {
        case GROUPS_GET_GROUP_SUCCESS:
        case COLLECTION_GET_SUCCESS:
            return unionBy(action.payload.collections, state, '_id');

        case COLLECTION_ADD_CARDS_REQUEST:
            return state.map(
                c =>
                    c._id === action.collection_id
                        ? assign({}, c, {
                              cards: [...c.cards, ...action.card_ids]
                          })
                        : c
            );

        case DB_CHANGE:
            return unionBy(
                action.payload.filter(d => d.type === 'collection'),
                state,
                '_id'
            );

        default:
            return state;
    }
}

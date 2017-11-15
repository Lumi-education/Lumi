import { assign, unionBy } from 'lodash';

import { Map } from 'immutable';

import { ITag } from 'lib/types';

import { arrayToObject } from 'client/utils';

import {
    TAGS_GET_TAGS_SUCCESS,
    TAGS_CREATE_TAG_SUCCESS,
    TAGS_DELETE_TAG_REQUEST,
    CARDS_GET_CARD_SUCCESS,
    DB_CHANGE
} from 'client/state/action-types';

export default function(
    state: Map<string, ITag> = Map<string, ITag>({}),
    action
): Map<string, ITag> {
    switch (action.type) {
        case TAGS_GET_TAGS_SUCCESS:
        case CARDS_GET_CARD_SUCCESS:
            return state.merge(
                Map<string, ITag>(arrayToObject(action.payload.tags))
            );

        case TAGS_CREATE_TAG_SUCCESS:
            const o = {};
            o[action.payload._id] = action.payload;
            return state.merge(Map<string, ITag>(o));

        case TAGS_DELETE_TAG_REQUEST:
            return state.delete(action.tag_id);

        case DB_CHANGE:
            return state.merge(
                Map<string, ITag>(
                    arrayToObject(action.payload.filter(d => d.type === 'tag'))
                )
            );

        default:
            return state;
    }
}

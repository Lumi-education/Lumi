import { assign, unionBy } from 'lodash';

import { Map } from 'immutable';

import { ITag } from '../types';

import { arrayToObject } from 'lib/core/utils';

import {
    TAGS_GET_TAGS_SUCCESS,
    TAGS_CREATE_TAG_SUCCESS,
    TAGS_DELETE_TAG_REQUEST
} from '../actions';

export default function(
    state: Map<string, ITag> = Map<string, ITag>({}),
    action
): Map<string, ITag> {
    switch (action.type) {
        case TAGS_GET_TAGS_SUCCESS:
        case 'DB_CHANGE':
            return state.merge(
                Map<string, ITag>(
                    arrayToObject(action.payload.filter(d => d.type === 'tag'))
                )
            );

        case TAGS_CREATE_TAG_SUCCESS:
            const o = {};
            o[action.payload._id] = action.payload;
            return state.merge(Map<string, ITag>(o));

        case TAGS_DELETE_TAG_REQUEST:
            return state.delete(action.tag_id);

        default:
            return state;
    }
}

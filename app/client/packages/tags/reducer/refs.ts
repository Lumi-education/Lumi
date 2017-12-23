import { assign, unionBy } from 'lodash';

import { Map } from 'immutable';

import { ITagRef } from '../types';

import { arrayToObject } from 'client/utils';

import {
    TAGS_ADD_TO_DOC_REQUEST,
    TAGS_REM_FROM_DOC_REQUEST,
    TAGS_GET_TAGS_SUCCESS
} from '../actions';

const defaultTagRef = {};

export default function(
    state: Map<string, ITagRef> = Map<string, ITagRef>({}),
    action
): Map<string, ITagRef> {
    switch (action.type) {
        case TAGS_ADD_TO_DOC_REQUEST:
            if (state.get(action.doc_id + '-tags')) {
                return state.update(action.doc_id + '-tags', tag_ref => {
                    tag_ref.tags.push(action.tag_id);
                    return tag_ref;
                });
            }
            return state.set(action.doc_id + '-tags', {
                doc_id: action.doc_id,
                tags: [action.tag_id],
                type: 'tag_ref'
            });

        case TAGS_REM_FROM_DOC_REQUEST:
            return state.delete(action.doc_id + action.tag_id);

        case TAGS_GET_TAGS_SUCCESS:
        case 'DB_CHANGE':
            return state.merge(
                Map<string, ITagRef>(
                    arrayToObject(
                        action.payload.filter(d => d.type === 'tag_ref')
                    )
                )
            );

        default:
            return state;
    }
}

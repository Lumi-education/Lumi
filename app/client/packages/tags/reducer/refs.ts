import { assign, unionBy } from 'lodash';

import { Map } from 'immutable';

import { ITagRef } from 'common/types';

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
            return state.set(action.doc_id + action.tag_id, {
                doc_id: action.doc_id,
                tag_id: action.tag_id,
                type: 'tag_ref'
            });

        case TAGS_REM_FROM_DOC_REQUEST:
            return state.delete(action.doc_id + action.tag_id);

        case TAGS_GET_TAGS_SUCCESS:
            return state.merge(
                Map<string, ITagRef>(arrayToObject(action.payload.tag_refs))
            );

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

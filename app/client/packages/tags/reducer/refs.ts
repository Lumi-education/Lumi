import { assign, unionBy } from 'lodash';

import { Map } from 'immutable';

import { ITagRef } from 'common/types';

import { arrayToObject } from 'client/utils';

import * as types from 'client/packages/action-types';

const defaultTagRef = {};

export default function(
    state: Map<string, ITagRef> = Map<string, ITagRef>({}),
    action
): Map<string, ITagRef> {
    switch (action.type) {
        case types.TAGS_ADD_TO_DOC_REQUEST:
            return state.set(action.doc_id + action.tag_id, {
                doc_id: action.doc_id,
                tag_id: action.tag_id,
                type: 'tag_ref'
            });

        case types.TAGS_REM_FROM_DOC_REQUEST:
            return state.delete(action.doc_id + action.tag_id);

        case types.TAGS_GET_TAGS_SUCCESS:
            return state.merge(
                Map<string, ITagRef>(arrayToObject(action.payload.tag_refs))
            );

        case types.DB_CHANGE:
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

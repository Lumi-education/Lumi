import { assign } from 'lodash';

import {
    TAGS_UI_SELECT_TAG_ID, // deprecate with universal selection module #286
    TAGS_UI_CHANGE_TAG,
    TAGS_UI_RESET_TAG, // deprecate with universal selection module #286
    TAGS_UI_SET_SELECTED_TAGS // deprecate with universal selection module #286
} from '../actions';

import { ITagsUI } from '../types';

const initialState: ITagsUI = {
    selected_tags: [], // deprecate with universal selection module #286
    tag: {
        _id: undefined,
        type: 'tag',
        name: undefined,
        short_name: undefined,
        description: undefined,
        color: undefined,
        created_at: undefined
    }
};

export default function(state: ITagsUI = initialState, action): ITagsUI {
    switch (action.type) {
        case TAGS_UI_SELECT_TAG_ID: // deprecate with universal selection module #286
            if (state.selected_tags.indexOf(action.payload.tag_id) > -1) {
                return assign({}, state, {
                    selected_tags: state.selected_tags.filter(
                        c => c !== action.payload.tag_id
                    )
                });
            }
            return assign({}, state, {
                selected_tags: [...state.selected_tags, action.payload.tag_id]
            });

        case TAGS_UI_SET_SELECTED_TAGS: // deprecate with universal selection module #286
            return assign({}, state, { selected_tags: action.payload.tag_ids });

        case TAGS_UI_CHANGE_TAG:
            return assign({}, state, {
                tag: assign({}, state.tag, action.payload)
            });

        case TAGS_UI_RESET_TAG:
            return assign({}, state, {
                tag: {}
            });

        default:
            return state;
    }
}

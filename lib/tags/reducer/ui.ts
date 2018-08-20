import { assign, unionBy } from 'lodash';

import {
    TAGS_UI_SELECT_TAG_ID,
    TAGS_UI_TOGGLE_DIALOG,
    TAGS_UI_CHANGE_TAG,
    TAGS_UI_RESET_TAG
} from '../actions';

import { ITagsUI } from '..';

const initialState: ITagsUI = {
    selected_tags: [],
    show_dialog: false,
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
        case TAGS_UI_SELECT_TAG_ID:
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

        case TAGS_UI_TOGGLE_DIALOG:
            return assign({}, state, {
                show_dialog: !state.show_dialog
            });

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

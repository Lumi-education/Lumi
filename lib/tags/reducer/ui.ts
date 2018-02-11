import { assign, unionBy } from 'lodash';

import { TAGS_UI_SELECT_TAG_ID } from '../actions';

import { ITagsUI } from '../';

const initialState: ITagsUI = {
    selected_tags: []
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
        default:
            return state;
    }
}

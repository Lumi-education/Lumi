import { assign, unionBy } from 'lodash';

import {
    COLLECTION_SELECT,
    COLLECTION_SELECTION_RESET,
    COLLECTION_UI_SHOW_ASSIGN_COLLECTION_DIALOG,
    COLLECTION_UI_HIDE_ASSIGN_COLLECTION_DIALOG
} from '../constants';

import { ICollectionUI } from '../';

const initialState: ICollectionUI = {
    selected_collections: [],
    show_assign_collection_dialog: false
};

export default function(
    state: ICollectionUI = initialState,
    action
): ICollectionUI {
    switch (action.type) {
        case COLLECTION_SELECT:
            if (
                state.selected_collections.indexOf(
                    action.payload.collection_id
                ) > -1
            ) {
                return assign({}, state, {
                    selected_collections: state.selected_collections.filter(
                        c => c !== action.payload.collection_id
                    )
                });
            }
            return assign({}, state, {
                selected_collections: [
                    ...state.selected_collections,
                    action.payload.collection_id
                ]
            });

        case COLLECTION_SELECTION_RESET:
            return assign({}, state, { selected_collections: [] });

        case COLLECTION_UI_SHOW_ASSIGN_COLLECTION_DIALOG:
            return assign({}, state, { show_assign_collection_dialog: true });

        case COLLECTION_UI_HIDE_ASSIGN_COLLECTION_DIALOG:
            return assign({}, state, { show_assign_collection_dialog: false });

        default:
            return state;
    }
}

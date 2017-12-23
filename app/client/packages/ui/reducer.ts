import { assign, uniq } from 'lodash';

import {
    UI_DIALOG_CLOSE,
    UI_DIALOG_OPEN,
    UI_LEFT_DRAWER_CLOSE,
    UI_OPEN_LEFT_DRAWER,
    UI_RIGHT_DRAWER_CLOSE,
    UI_RIGHT_DRAWER_OPEN,
    UI_SNACKBAR_OPEN,
    UI_TOGGLE_CARDS_DIALOG,
    UI_SELECT_CARD,
    UI_SET_RIGHT_APPBAR_ICON,
    UI_TOGGLE_TAG_ID_FILTER,
    COLLECTION_ADD_CARDS_SUCCESS
} from '../action-types';

interface IUI {
    left_drawer_show: boolean;
    right_drawer_show: boolean;
    dialog_show: boolean;
    snackbar_open: boolean;
    snackbar_text: string;
    show_cards_dialog: boolean;
    selected_card_ids: string[];
    right_appbar_icon: JSX.Element;
    tags_filter: string[];
}

const initialState: IUI = {
    left_drawer_show: false,
    right_drawer_show: false,
    dialog_show: false,
    snackbar_open: false,
    snackbar_text: '',
    show_cards_dialog: false,
    selected_card_ids: [],
    right_appbar_icon: null,
    tags_filter: []
};

export default function(state: IUI = initialState, action): IUI {
    switch (action.type) {
        case UI_SNACKBAR_OPEN:
            return assign({}, state, {
                snackbar_open: true,
                snackbar_text: action.payload.text
            });

        case UI_SELECT_CARD:
            return assign({}, state, {
                selected_card_ids:
                    state.selected_card_ids.indexOf(action.card_id) > -1
                        ? state.selected_card_ids.filter(
                              id => id !== action.card_id
                          )
                        : uniq([...state.selected_card_ids, action.card_id])
            });

        case COLLECTION_ADD_CARDS_SUCCESS:
            return assign({}, state, { selected_card_ids: [] });

        case UI_TOGGLE_CARDS_DIALOG:
            return assign({}, state, {
                show_cards_dialog: !state.show_cards_dialog
            });

        case UI_OPEN_LEFT_DRAWER:
            return assign({}, state, { left_drawer_show: true });

        case UI_LEFT_DRAWER_CLOSE:
            return assign({}, state, { left_drawer_show: false });

        case UI_DIALOG_OPEN:
            return assign({}, state, { dialog_show: true });

        case UI_DIALOG_CLOSE:
            return assign({}, state, { dialog_show: false });

        case UI_RIGHT_DRAWER_OPEN:
            return assign({}, state, { right_drawer_show: true });

        case UI_RIGHT_DRAWER_CLOSE:
            return assign({}, state, { right_drawer_show: false });

        case UI_SET_RIGHT_APPBAR_ICON:
            return assign({}, state, { right_appbar_icon: action.payload });

        case UI_TOGGLE_TAG_ID_FILTER:
            if (state.tags_filter.indexOf(action.payload.tag_id) > -1) {
                return assign({}, state, {
                    tags_filter: state.tags_filter.filter(
                        tag_id => tag_id !== action.payload.tag_id
                    )
                });
            }
            return assign({}, state, {
                tags_filter: [...state.tags_filter, action.payload.tag_id]
            });

        default:
            return state;
    }
}

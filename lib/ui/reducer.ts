import { assign, uniq } from 'lodash';

import { IUI } from './types';

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
    UI_SET_APPBAR_TITLE,
    UI_TOGGLE_ASSIGN_MATERIAL_DIALOG,
    UI_TOGGLE_CREATE_USER_DIALOG,
    UI_ASSIGN_GROUP_DIALOG,
    UI_DELETE_USER_DIALOG,
    UI_TOGGLE_CREATE_CARD_DIALOG,
    UI_SNACKBAR_CLOSE,
    UI_TOGGLE_SHOW_COMPLETED_ASSIGNMENTS,
    UI_SHOW_ALARM_DIALOG,
    UI_HIDE_ALARM_DIALOG,
    UI_SET_SEARCH_FILTER
} from './actions';

const initialState: IUI = {
    left_drawer_show: false,
    right_drawer_show: false,
    dialog_show: false,
    snackbar_open: false,
    snackbar_text: '',
    show_cards_dialog: false,
    selected_card_ids: [],
    right_appbar_icon: null,
    appbar_title: '',
    show_assign_material_dialog: false,
    show_create_user_dialog: false,
    show_assign_group_dialog: false,
    show_delete_user_dialog: false,
    show_create_card_dialog: false,
    show_completed_assignments: false,
    show_alarm_dialog: false,
    alarm_dialog_message: '',
    search_filter_text: '',
    colors: {
        primary: '#3498db',
        secondary: '#1abc9c',
        pending: '#f39c12',
        error: '#c0392c',
        success: '#27ae60'
    }
};

export default function(state: IUI = initialState, action): IUI {
    switch (action.type) {
        case UI_SET_APPBAR_TITLE:
            return assign({}, state, { appbar_title: action.payload.title });

        case UI_SHOW_ALARM_DIALOG:
            return assign({}, state, {
                show_alarm_dialog: true,
                alarm_dialog_message: action.message
            });

        case UI_SET_SEARCH_FILTER:
            return assign({}, state, { search_filter_text: action.text });

        case UI_HIDE_ALARM_DIALOG:
            return assign({}, state, {
                show_alarm_dialog: false,
                alarm_dialog_message: ''
            });

        case UI_SNACKBAR_OPEN:
            return assign({}, state, {
                snackbar_open: true,
                snackbar_text: action.payload.text
            });

        case UI_SNACKBAR_CLOSE:
            return assign({}, state, {
                snackbar_open: false,
                snackbar_text: ''
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

        case UI_TOGGLE_CARDS_DIALOG:
            return assign({}, state, {
                show_cards_dialog: !state.show_cards_dialog
            });

        case UI_TOGGLE_ASSIGN_MATERIAL_DIALOG:
            return assign({}, state, {
                show_assign_material_dialog: !state.show_assign_material_dialog
            });

        case UI_TOGGLE_CREATE_USER_DIALOG:
            return assign({}, state, {
                show_create_user_dialog: !state.show_create_user_dialog
            });

        case UI_ASSIGN_GROUP_DIALOG:
            return assign({}, state, {
                show_assign_group_dialog: !state.show_assign_group_dialog
            });

        case UI_DELETE_USER_DIALOG:
            return assign({}, state, {
                show_delete_user_dialog: !state.show_delete_user_dialog
            });

        case UI_TOGGLE_CREATE_CARD_DIALOG:
            return assign({}, state, {
                show_create_card_dialog: !state.show_create_card_dialog
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

        case UI_TOGGLE_SHOW_COMPLETED_ASSIGNMENTS:
            return assign({}, state, {
                show_completed_assignments: !state.show_completed_assignments
            });

        default:
            if (action.type.indexOf('_ERROR') > -1) {
                console.log(action);
                return assign({}, state, {
                    snackbar_text: action.response.message,
                    snackbar_open: true
                });
            }
            return state;
    }
}

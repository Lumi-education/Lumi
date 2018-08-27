import { push as _push, goBack } from 'react-router-redux';

export const UI_OPEN_LEFT_DRAWER = 'UI_OPEN_LEFT_DRAWER';
export const UI_LEFT_DRAWER_CLOSE = 'UI_LEFT_DRAWER_CLOSE';
export const UI_CLOSE_LEFT_DRAWER = 'UI_CLOSE_LEFT_DRAWER';
export const UI_RIGHT_DRAWER_OPEN = 'UI_RIGHT_DRAWER_OPEN';
export const UI_RIGHT_DRAWER_CLOSE = 'UI_RIGHT_DRAWER_CLOSE';
export const UI_DIALOG_OPEN = 'UI_DIALOG_OPEN';
export const UI_DIALOG_CLOSE = 'UI_DIALOG_CLOSE';
export const UI_SNACKBAR_OPEN = 'UI_SNACKBAR_OPEN';
export const UI_SNACKBAR_CLOSE = 'UI_SNACBKBAR_CLOSE';
export const UI_TOGGLE_CARDS_DIALOG = 'UI_TOGGLE_CARDS_DIALOG';
export const UI_SELECT_CARD = 'UI_SELECT_CARD';
export const UI_SET_RIGHT_APPBAR_ICON = 'UI_SET_RIGHT_APPBAR_ICON';
export const UI_SET_APPBAR_TITLE = 'UI_SET_APPBAR_TITLE';
export const UI_TOGGLE_ASSIGN_MATERIAL_DIALOG =
    'UI_TOGGLE_ASSIGN_MATERIAL_DIALOG';
export const UI_TOGGLE_CREATE_USER_DIALOG = 'UI_TOGGLE_CREATE_USER_DIALOG';
export const UI_ASSIGN_GROUP_DIALOG = 'UI_ASSIGN_GROUP_DIALOG';
export const UI_DELETE_USER_DIALOG = 'UI_DELETE_USER_DIALOG';
export const UI_TOGGLE_CREATE_CARD_DIALOG = 'UI_TOGGLE_CREATE_CARD_DIALOG';
export const UI_TOGGLE_SHOW_COMPLETED_ASSIGNMENTS =
    'UI_TOGGLE_SHOW_COMPLETED_ASSIGNMENTS';

export const UI_SHOW_SNACKBAR = 'UI_SHOW_SNACKBAR';

export function push(url: string) {
    return dispatch => {
        dispatch(left_drawer_close());
        dispatch(right_drawer_close());
        dispatch(_push(url));
    };
}

export function goBack() {
    return dispatch => {
        dispatch(goBack());
    };
}

export function set_appbar_title(title: string) {
    return {
        type: UI_SET_APPBAR_TITLE,
        payload: { title }
    };
}

export function select_card(card_id: string) {
    return {
        card_id,
        type: UI_SELECT_CARD
    };
}

export function set_right_appbar_icon(icon: JSX.Element) {
    return {
        type: UI_SET_RIGHT_APPBAR_ICON,
        payload: icon
    };
}

export function snackbar_open(text: string) {
    return {
        type: UI_SNACKBAR_OPEN,
        payload: { text }
    };
}

export function snackbar_close() {
    return {
        type: UI_SNACKBAR_CLOSE
    };
}

export function toggle_cards_dialog() {
    return {
        type: UI_TOGGLE_CARDS_DIALOG
    };
}
export function dialog_open() {
    return {
        type: UI_DIALOG_OPEN
    };
}

export function dialog_close() {
    return {
        type: UI_DIALOG_CLOSE
    };
}
export function left_drawer_open() {
    return {
        type: UI_OPEN_LEFT_DRAWER
    };
}

export function left_drawer_close() {
    return {
        type: UI_LEFT_DRAWER_CLOSE
    };
}

export function right_drawer_open() {
    return {
        type: UI_RIGHT_DRAWER_OPEN
    };
}

export function right_drawer_close() {
    return {
        type: UI_RIGHT_DRAWER_CLOSE
    };
}

export function toggle_assign_material_dialog() {
    return {
        type: UI_TOGGLE_ASSIGN_MATERIAL_DIALOG
    };
}

export function toggle_create_user_dialog() {
    return {
        type: UI_TOGGLE_CREATE_USER_DIALOG
    };
}
export function toggle_assign_group_dialog() {
    return {
        type: UI_ASSIGN_GROUP_DIALOG
    };
}
export function toggle_delete_user_dialog() {
    return {
        type: UI_DELETE_USER_DIALOG
    };
}
export function toggle_create_card_dialog() {
    return {
        type: UI_TOGGLE_CREATE_CARD_DIALOG
    };
}
export function toggle_show_completed_assignments() {
    return {
        type: UI_TOGGLE_SHOW_COMPLETED_ASSIGNMENTS
    };
}

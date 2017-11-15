import { UI } from './types';
import { push as _push } from 'react-router-redux';
import * as qs from 'query-string';
import * as url_parse from 'url-parse';

import { session_update } from '../session/actions';
import {
    UI_DIALOG_CLOSE,
    UI_DIALOG_OPEN,
    UI_LEFT_DRAWER_CLOSE,
    UI_OPEN_LEFT_DRAWER,
    UI_RIGHT_DRAWER_CLOSE,
    UI_RIGHT_DRAWER_OPEN,
    UI_SNACKBAR_OPEN,
    UI_SNACKBAR_CLOSE
} from '../action-types';

export function push(url: string) {
    return dispatch => {
        dispatch(left_drawer_close());
        dispatch(_push(url));
        // dispatch( session_update({ location: url }) );
    };
}

export function snackbar_open(text: string) {
    return {
        type: UI_SNACKBAR_OPEN,
        payload: { text }
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

import * as debug from 'debug';
import { push as _push, goBack as _goBack } from 'connected-react-router';

export const UI_OPEN_LEFT_DRAWER = 'UI_OPEN_LEFT_DRAWER';
export const UI_LEFT_DRAWER_CLOSE = 'UI_LEFT_DRAWER_CLOSE';
export const UI_CLOSE_LEFT_DRAWER = 'UI_CLOSE_LEFT_DRAWER';
export const UI_RIGHT_DRAWER_OPEN = 'UI_RIGHT_DRAWER_OPEN';
export const UI_RIGHT_DRAWER_CLOSE = 'UI_RIGHT_DRAWER_CLOSE';
export const UI_SET_SEARCH_FILTER = 'UI_SET_SEARCH_FILTER';

const log_info = debug('lumi:info:actions:ui');

export function push(url: string) {
    log_info('push', url);
    return dispatch => {
        dispatch(left_drawer_close());
        dispatch(right_drawer_close());
        dispatch(_push(url));
    };
}

export function goBack() {
    return dispatch => {
        dispatch(_goBack());
    };
}

export function set_search_filter(text: string) {
    return {
        text,
        type: UI_SET_SEARCH_FILTER
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

import { assign } from 'lodash';

import {
    UI_DIALOG_CLOSE,
    UI_DIALOG_OPEN,
    UI_LEFT_DRAWER_CLOSE,
    UI_OPEN_LEFT_DRAWER,
    UI_RIGHT_DRAWER_CLOSE,
    UI_RIGHT_DRAWER_OPEN,
    UI_SNACKBAR_OPEN
} from '../action-types';

interface IUI { 
    left_drawer_show: boolean;
    right_drawer_show: boolean;
    dialog_show: boolean;
    snackbar_open: boolean;
    snackbar_text: string;
}

const initialState: IUI = {
    left_drawer_show: false,
    right_drawer_show: false,
    dialog_show: false,
    snackbar_open: false,
    snackbar_text: ''
};

export default function(state: IUI = initialState, action): IUI {
    switch (action.type) {
        case UI_SNACKBAR_OPEN:
            return assign({}, state, {
                snackbar_open: true,
                snackbar_text: action.payload.text
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

        default:
            return state;
    }
}

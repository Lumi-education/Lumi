import { assign } from 'lodash';

import { IUI } from './types';

import {
    UI_LEFT_DRAWER_CLOSE,
    UI_OPEN_LEFT_DRAWER,
    UI_RIGHT_DRAWER_CLOSE,
    UI_RIGHT_DRAWER_OPEN,
    UI_SET_SEARCH_FILTER
} from './actions';

const initialState: IUI = {
    left_drawer_show: false,
    right_drawer_show: false,
    search_filter_text: ''
};

export default function(state: IUI = initialState, action): IUI {
    switch (action.type) {
        case UI_SET_SEARCH_FILTER:
            return assign({}, state, { search_filter_text: action.text });

        case UI_OPEN_LEFT_DRAWER:
            return assign({}, state, { left_drawer_show: true });

        case UI_LEFT_DRAWER_CLOSE:
            return assign({}, state, { left_drawer_show: false });

        case UI_RIGHT_DRAWER_OPEN:
            return assign({}, state, { right_drawer_show: true });

        case UI_RIGHT_DRAWER_CLOSE:
            return assign({}, state, { right_drawer_show: false });

        default:
            return state;
    }
}

import { assign } from 'lodash';

import { CARDS_CHANGE_SUBJECT } from '../actions';

import { IUICardSearchMenu } from '../types';

const initialState: IUICardSearchMenu = {
    subject: undefined
};

export default function(
    state: IUICardSearchMenu = initialState,
    action
): IUICardSearchMenu {
    switch (action.type) {
        case CARDS_CHANGE_SUBJECT:
            return assign({}, state, { subject: action.subject });

        default:
            return state;
    }
}

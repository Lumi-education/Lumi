import { assign, unionBy } from 'lodash';

import {
    USERS_UI_SELECT,
    USERS_UI_SELECTION_RESET,
    USERS_UI_SET_SELECTED_USERS
} from '../constants';

import { IUsersUI } from '../';

const initialState: IUsersUI = {
    selected_users: []
};

export default function(state: IUsersUI = initialState, action): IUsersUI {
    switch (action.type) {
        case USERS_UI_SELECT:
            if (state.selected_users.indexOf(action.payload.user_id) > -1) {
                return assign({}, state, {
                    selected_users: state.selected_users.filter(
                        c => c !== action.payload.user_id
                    )
                });
            }
            return assign({}, state, {
                selected_users: [
                    ...state.selected_users,
                    action.payload.user_id
                ]
            });

        case USERS_UI_SELECTION_RESET:
            return assign({}, state, { selected_users: [] });

        case USERS_UI_SET_SELECTED_USERS:
            return assign({}, state, {
                selected_users: action.payload.user_ids
            });

        default:
            return state;
    }
}

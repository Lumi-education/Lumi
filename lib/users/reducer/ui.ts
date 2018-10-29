import { assign } from 'lodash';

import {
    USERS_UI_SELECT,
    USERS_UI_SELECTION_RESET,
    USERS_UI_SET_SELECTED_USERS,
    USERS_UI_CHANGE_USER
} from '../actions';

import { IUsersUI } from '..';

const initialState: IUsersUI = {
    selected_users: [],
    user: {
        _id: undefined,
        _deleted: false,
        type: 'user',
        name: 'no user',
        level: 0,
        groups: [],
        last_active: new Date(),
        last_login: new Date(),
        online: false,
        location: '',
        password: '',
        flow: []
    }
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

        case USERS_UI_CHANGE_USER:
            const new_user = assign({}, state.user, action.payload);
            return assign({}, state, { user: new_user });

        default:
            return state;
    }
}

import { assign } from 'lodash';

import * as Core from 'lib/core';

import {
    USERS_UI_SELECT,
    USERS_UI_SELECTION_RESET,
    USERS_UI_SET_SELECTED_USERS,
    USERS_UI_CHANGE_USER,
    USERS_UI_ADD_USER_TO_CREATE,
    USERS_UI_SET_USERNAME_TO_CREATE,
    USERS_UI_ADD_USER_TO_CREATE_ERROR,
    USERS_UI_REMOVE_USER_FROM_CREATE,
    USERS_CREATE_USER_SUCCESS,
    USERS_UI_SHOW_DIALOG,
    USERS_UI_CLOSE_DIALOG,
    USERS_DELETE_USERS_SUCCESS,
    USERS_UI_CHANGE_USER_OPTIONS,
    USERS_UPDATE_USER_SUCCESS
} from '../actions';

import { IUsersUI } from '../types';

const initialState: IUsersUI = {
    selected_users: [],
    user: {
        _id: undefined,
        _rev: undefined,
        _deleted: false,
        type: 'user',
        name: 'no user',
        level: 0,
        groups: [],
        password: '',
        flow: [],
        _attachments: {}
    },
    users_to_create: [],
    username_to_create: '',
    error: { message: '' },
    dialogs: {},
    user_options: {}
};

export default function(state: IUsersUI = initialState, action): IUsersUI {
    try {
        switch (action.type) {
            case USERS_UI_ADD_USER_TO_CREATE:
                return assign({}, state, {
                    users_to_create: [...state.users_to_create, action.payload],
                    username_to_create: ''
                });

            case USERS_CREATE_USER_SUCCESS:
                return assign({}, state, {
                    users_to_create: [],
                    username_to_create: ''
                });

            case USERS_UI_SET_USERNAME_TO_CREATE:
                return assign({}, state, {
                    username_to_create: action.payload.replace(
                        /[^a-z0-9]/gi,
                        ''
                    ),
                    error: { message: '' }
                });

            case USERS_UI_ADD_USER_TO_CREATE_ERROR:
                return assign({}, state, {
                    error: { message: action.payload.message }
                });

            case USERS_UI_REMOVE_USER_FROM_CREATE:
                return assign({}, state, {
                    users_to_create: state.users_to_create.filter(
                        username => username !== action.payload
                    )
                });

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
            case USERS_DELETE_USERS_SUCCESS:
            case USERS_UPDATE_USER_SUCCESS:
                return assign({}, state, { selected_users: [] });

            case USERS_UI_SET_SELECTED_USERS:
                return assign({}, state, {
                    selected_users: action.payload.user_ids
                });

            case USERS_UI_CHANGE_USER:
                const new_user = assign({}, state.user, action.payload);
                return assign({}, state, { user: new_user });

            case USERS_UI_SHOW_DIALOG:
                return {
                    ...state,
                    dialogs: assign({}, state.dialogs, {
                        [action.payload.key]: true
                    })
                };

            case USERS_UI_CLOSE_DIALOG:
                return {
                    ...state,
                    dialogs: assign({}, state.dialogs, {
                        [action.payload.key]: false
                    })
                };

            case USERS_UI_CHANGE_USER_OPTIONS:
                return {
                    ...state,
                    user_options: assign({}, state.user_options, action.payload)
                };

            default:
                return state;
        }
    } catch (error) {
        Core.raven.captureException(error);
        return state;
    }
}

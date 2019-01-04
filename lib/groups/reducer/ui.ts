import { assign } from 'lodash';
import { IGroupUI } from '../types';
import * as Core from 'lib/core';

import {
    GROUPS_SELECT_GROUP,
    GROUPS_UI_SET_SELECTED_GROUPS,
    GROUPS_UI_CHANGE_GROUP,
    GROUPS_CREATE_SUCCESS,
    GROUPS_CREATE_ERROR,
    GROUPS_UI_RESET_GROUP,
    GROUPS_UI_OPEN_DIALOG,
    GROUPS_UI_CLOSE_DIALOG,
    GROUPS_DELETE_GROUP_SUCCESS
} from '../actions';
import { Group } from '../models';

const initialState: IGroupUI = {
    selected_groups: [], // deprecate with universal selection module #286
    group: new Group(),
    error: {
        message: ''
    },
    dialogs: {}
};

export default function(state: IGroupUI = initialState, action): IGroupUI {
    try {
        switch (action.type) {
            case GROUPS_UI_RESET_GROUP:
                return assign({}, state, {
                    group: {
                        _id: undefined,
                        type: 'group',
                        name: '',
                        created_at: new Date(),
                        autojoin: false,
                        cards: []
                    }
                });

            case GROUPS_CREATE_ERROR:
                return assign({}, state, {
                    error: { message: action.payload.message }
                });

            case GROUPS_SELECT_GROUP: // deprecate with universal selection module #286
                if (
                    state.selected_groups.indexOf(action.payload.group_id) > -1
                ) {
                    return assign({}, state, {
                        selected_groups: state.selected_groups.filter(
                            c => c !== action.payload.group_id
                        )
                    });
                }
                return assign({}, state, {
                    selected_groups: [
                        ...state.selected_groups,
                        action.payload.group_id
                    ]
                });

            case GROUPS_DELETE_GROUP_SUCCESS:
                return {
                    ...state,
                    selected_groups: []
                };

            case GROUPS_UI_SET_SELECTED_GROUPS: // deprecate with universal selection module #286
                return assign({}, state, {
                    selected_groups: action.group_ids
                });

            case GROUPS_UI_CHANGE_GROUP:
                const new_group = assign({}, state.group, action.payload);
                return assign({}, state, {
                    group: new_group,
                    error: { message: '' }
                });

            case 'CORE_UPDATE_DB_SUCCESS':
            case 'DB_CHANGE':
                const updated_group = action.payload.filter(
                    doc => doc.type === 'group' && doc._id === state.group._id
                )[0];

                return assign({}, state, {
                    group: assign({}, state.group, updated_group)
                });

            case GROUPS_UI_OPEN_DIALOG:
                return {
                    ...state,
                    dialogs: assign({}, state.dialogs, {
                        [action.payload.key]: true
                    })
                };

            case GROUPS_CREATE_SUCCESS:
                return {
                    ...state,
                    dialogs: assign({}, state.dialogs, { create: false }),
                    group: new Group()
                };
            case GROUPS_UI_CLOSE_DIALOG:
                return {
                    ...state,
                    dialogs: assign({}, state.dialogs, {
                        [action.payload.key]: false
                    })
                };

            default:
                return state;
        }
    } catch (error) {
        Core.raven.captureException(error);
        return state;
    }
}

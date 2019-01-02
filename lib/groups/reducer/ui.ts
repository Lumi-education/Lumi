import { assign } from 'lodash';
import { IGroupUI } from '../types';

import {
    GROUPS_SELECT_GROUP,
    GROUPS_UI_SET_SELECTED_GROUPS,
    GROUPS_UI_CHANGE_GROUP,
    GROUPS_CREATE_SUCCESS,
    GROUPS_CREATE_ERROR,
    GROUPS_UI_RESET_GROUP
} from '../actions';

const initialState: IGroupUI = {
    selected_groups: [], // deprecate with universal selection module #286
    group: {
        _id: undefined,
        _rev: undefined,
        _deleted: false,
        _attachments: {},
        type: 'group',
        name: '',
        created_at: new Date(),
        autojoin: false,
        cards: []
    },
    error: {
        message: ''
    }
};

export default function(state: IGroupUI = initialState, action): IGroupUI {
    switch (action.type) {
        case GROUPS_CREATE_SUCCESS:
            return assign({}, state, {
                group: {
                    _id: undefined,
                    type: 'group',
                    name: '',
                    created_at: new Date(),
                    autojoin: false,
                    cards: []
                },
                show_create_group_dialog: false
            });

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
            if (state.selected_groups.indexOf(action.payload.group_id) > -1) {
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

        default:
            return state;
    }
}

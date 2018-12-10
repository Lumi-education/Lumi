import { assign } from 'lodash';
import { IGroupUI } from '../types';

import {
    GROUPS_SELECT_GROUP,
    GROUPS_UI_SET_SELECTED_GROUPS,
    GROUPS_UI_CHANGE_GROUP,
    GROUPS_ADD_CARDS_REQUEST
} from '../actions';

const initialState: IGroupUI = {
    selected_groups: [],
    group: {
        _id: undefined,
        type: 'group',
        name: 'no group',
        created_at: new Date(),
        autojoin: false,
        cards: []
    }
};

export default function(state: IGroupUI = initialState, action): IGroupUI {
    switch (action.type) {
        case GROUPS_SELECT_GROUP:
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

        case GROUPS_ADD_CARDS_REQUEST:
            const _group = assign({}, state.group, {
                cards: [...state.group.cards, ...action.card_ids]
            });
            return assign({}, state, { group: _group });

        case GROUPS_UI_SET_SELECTED_GROUPS:
            return assign({}, state, {
                selected_groups: action.group_ids
            });

        case GROUPS_UI_CHANGE_GROUP:
            const new_group = assign({}, state.group, action.payload);
            return assign({}, state, { group: new_group });

        case 'CORE_UPDATE_DB_SUCCESS':
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

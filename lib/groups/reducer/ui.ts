import { assign, unionBy } from 'lodash';
import { IGroupUI } from '../types';

import { GROUPS_SELECT_GROUP, GROUPS_UI_SET_SELECTED_GROUPS } from '../actions';

const initialState: IGroupUI = {
    selected_groups: []
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

        case GROUPS_UI_SET_SELECTED_GROUPS:
            return assign({}, state, {
                selected_groups: action.group_ids
            });

        default:
            return state;
    }
}

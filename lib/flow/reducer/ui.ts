import { assign } from 'lodash';

import { IFlowUI } from '../types';
import {
    FLOW_UI_SET_SELECTED_ASSIGNMENTS,
    FLOW_UI_SELECT_ASSIGNMENT
} from '../actions';

const initialState: IFlowUI = {
    selected_assignments: []
};

export default function(state: IFlowUI = initialState, action): IFlowUI {
    switch (action.type) {
        case FLOW_UI_SELECT_ASSIGNMENT:
            if (
                state.selected_assignments.indexOf(
                    action.payload.assignment_id
                ) > -1
            ) {
                return assign({}, state, {
                    selected_assignments: state.selected_assignments.filter(
                        c => c !== action.payload.assignment_id
                    )
                });
            }
            return assign({}, state, {
                selected_assignments: [
                    ...state.selected_assignments,
                    action.payload.assignment_id
                ]
            });

        case FLOW_UI_SET_SELECTED_ASSIGNMENTS:
            return assign({}, state, {
                selected_assignments: action.payload.assignment_ids
            });

        default:
            return state;
    }
}

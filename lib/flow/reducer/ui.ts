import { assign } from 'lodash';

import { IFlowUI } from '../types';
import {
    FLOW_UI_SET_SELECTED_ASSIGNMENTS,
    FLOW_UI_SELECT_ASSIGNMENT,
    FLOW_UI_CHANGE_ASSIGNMENT,
    FLOW_UI_RESET_ASSIGNMENT
} from '../actions';

const initialState: IFlowUI = {
    selected_assignments: [],
    show_dialog: false,
    assignment: {}
};

export default function(state: IFlowUI = initialState, action): IFlowUI {
    switch (action.type) {
        case FLOW_UI_SELECT_ASSIGNMENT: // deprecate with universal selection module #286
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

        case FLOW_UI_SET_SELECTED_ASSIGNMENTS: // deprecate with universal selection module #286
            return assign({}, state, {
                selected_assignments: action.payload.assignment_ids
            });

        case FLOW_UI_CHANGE_ASSIGNMENT:
            const new_assignment = assign({}, state.assignment, action.payload);
            return assign({}, state, { assignment: new_assignment });

        case FLOW_UI_RESET_ASSIGNMENT:
            return assign({}, state, { assignment: {} });
        default:
            return state;
    }
}

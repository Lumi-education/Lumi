export const FLOW_ASSIGN_REQUEST = 'FLOW_ASSIGN_REQUEST';
export const FLOW_ASSIGN_SUCCESS = 'FLOW_ASSIGN_SUCCESS';
export const FLOW_ASSIGN_ERROR = 'FLOW_ASSIGN_ERROR';

export const FLOW_DELETE_ASSIGNMENT_REQUEST = 'FLOW_DELETE_ASSIGNMENT_REQUEST';
export const FLOW_DELETE_ASSIGNMENT_SUCCESS = 'FLOW_DELETE_ASSIGNMENT_SUCCESS';
export const FLOW_DELETE_ASSIGNMENT_ERROR = 'FLOW_DELETE_ASSIGNMENT_ERROR';

export const FLOW_UPDATE_ASSIGNMENT_REQUEST = 'FLOW_UPDATE_ASSIGNMENT_REQUEST';
export const FLOW_UPDATE_ASSIGNMENT_SUCCESS = 'FLOW_UPDATE_ASSIGNMENT_SUCCESS';
export const FLOW_UPDATE_ASSIGNMENT_ERROR = 'FLOW_UPDATE_ASSIGNMENT_ERROR';

export const FLOW_UI_SELECT_ASSIGNMENT = 'FLOW_UI_SELECT_ASSIGNMENT';
export const FLOW_UI_SET_SELECTED_ASSIGNMENTS =
    ' FLOW_UI_SET_SELECTED_ASSIGNMENTS:';

import * as API from './api';

export function assign(user_ids: string[], card_ids: string[]) {
    return {
        types: [FLOW_ASSIGN_REQUEST, FLOW_ASSIGN_SUCCESS, FLOW_ASSIGN_ERROR],
        api: API.assign(user_ids, card_ids),
        payload: {
            user_ids,
            card_ids
        }
    };
}

export function update_assignments(assignment_ids: string[], update: any) {
    return {
        types: [
            FLOW_DELETE_ASSIGNMENT_REQUEST,
            FLOW_DELETE_ASSIGNMENT_SUCCESS,
            FLOW_DELETE_ASSIGNMENT_ERROR
        ],
        api: API.update_assignments(assignment_ids, update),
        payload: {
            assignment_ids,
            update
        }
    };
}

export function delete_assignments(assignment_ids: string[]) {
    return {
        types: [
            FLOW_DELETE_ASSIGNMENT_REQUEST,
            FLOW_DELETE_ASSIGNMENT_SUCCESS,
            FLOW_DELETE_ASSIGNMENT_ERROR
        ],
        api: API.delete_assignments(assignment_ids),
        payload: {
            assignment_ids
        }
    };
}

export function select_assignment(assignment_id: string) {
    return {
        type: FLOW_UI_SELECT_ASSIGNMENT,
        payload: { assignment_id }
    };
}

export function set_selected_assignments(assignments_ids: string[]) {
    return {
        type: FLOW_UI_SET_SELECTED_ASSIGNMENTS,
        payload: { assignments_ids }
    };
}

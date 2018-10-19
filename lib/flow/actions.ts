export const FLOW_ASSIGN_REQUEST = 'FLOW_ASSIGN_REQUEST';
export const FLOW_ASSIGN_SUCCESS = 'FLOW_ASSIGN_SUCCESS';
export const FLOW_ASSIGN_ERROR = 'FLOW_ASSIGN_ERROR';
export const FLOW_GET_ASSIGNMENTS_REQUEST = 'FLOW_GET_ASSIGNMENTS_REQUEST';
export const FLOW_GET_ASSIGNMENTS_SUCCESS = 'FLOW_GET_ASSIGNMENTS_SUCCESS';
export const FLOW_GET_ASSIGNMENTS_ERROR = 'FLOW_GET_ASSIGNMENTS_ERROR';
export const FLOW_DELETE_ASSIGNMENT_REQUEST = 'FLOW_DELETE_ASSIGNMENT_REQUEST';
export const FLOW_DELETE_ASSIGNMENT_SUCCESS = 'FLOW_DELETE_ASSIGNMENT_SUCCESS';
export const FLOW_DELETE_ASSIGNMENT_ERROR = 'FLOW_DELETE_ASSIGNMENT_ERROR';
export const FLOW_UPDATE_ASSIGNMENT_REQUEST = 'FLOW_UPDATE_ASSIGNMENT_REQUEST';
export const FLOW_UPDATE_ASSIGNMENT_SUCCESS = 'FLOW_UPDATE_ASSIGNMENT_SUCCESS';
export const FLOW_UPDATE_ASSIGNMENT_ERROR = 'FLOW_UPDATE_ASSIGNMENT_ERROR';
export const FLOW_ARCHIVE_ASSIGNMENT_REQUEST =
    'FLOW_ARCHIVE_ASSIGNMENT_REQUEST';
export const FLOW_ARCHIVE_ASSIGNMENT_SUCCESS =
    'FLOW_ARCHIVE_ASSIGNMENT_SUCCESS';
export const FLOW_ARCHIVE_ASSIGNMENT_ERROR = 'FLOW_ARCHIVE_ASSIGNMENT_ERROR';
export const FLOW_SAVE_STATE_REQUEST = 'FLOW_SAVE_STATE_REQUEST';
export const FLOW_SAVE_STATE_SUCCESS = 'FLOW_SAVE_STATE_SUCCESS';
export const FLOW_SAVE_STATE_ERROR = 'FLOW_SAVE_STATE_ERROR';
export const FLOW_SAVE_DATA_REQUEST = 'FLOW_SAVE_DATA_REQUEST';
export const FLOW_SAVE_DATA_SUCCESS = 'FLOW_SAVE_DATA_SUCCESS';
export const FLOW_SAVE_DATA_ERROR = 'FLOW_SAVE_DATA_ERROR';
export const FLOW_SYNC_ASSIGNMENTS_REQUEST = 'FLOW_SYNC_ASSIGNMENTS_REQUEST';
export const FLOW_SYNC_ASSIGNMENTS_SUCCESS = 'FLOW_SYNC_ASSIGNMENTS_SUCCESS';
export const FLOW_SYNC_ASSIGNMENTS_ERROR = 'FLOW_SYNC_ASSIGNMENTS_ERROR';
export const FLOW_UI_SELECT_ASSIGNMENT = 'FLOW_UI_SELECT_ASSIGNMENT';
export const FLOW_UI_SET_SELECTED_ASSIGNMENTS =
    ' FLOW_UI_SET_SELECTED_ASSIGNMENTS:';
export const FLOW_UI_CHANGE_ASSIGNMENT = 'FLOW_UI_CHANGE_ASSIGNMENT';
export const FLOW_UI_TOGGLE_DIALOG = 'FLOW_UI_TOGGLE_DIALOG';
export const FLOW_UI_RESET_ASSIGNMENT = 'FLOW_UI_RESET_ASSIGNMENT';

import * as API from './api';
import { IAssignment } from './types';

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

export function save_state(assignment_id: string, state: any) {
    return {
        types: [
            FLOW_SAVE_STATE_REQUEST,
            FLOW_SAVE_STATE_SUCCESS,
            FLOW_SAVE_STATE_ERROR
        ],
        api: API.save_state(assignment_id, state),
        payload: { assignment_id, state }
    };
}

export function save_data(assignment_id: string, data: IAssignment['data']) {
    return {
        types: [
            FLOW_SAVE_DATA_REQUEST,
            FLOW_SAVE_DATA_SUCCESS,
            FLOW_SAVE_DATA_ERROR
        ],
        api: API.save_data(assignment_id, data),
        payload: { assignment_id, data }
    };
}

export function update_assignments(assignment_ids: string[], update: any) {
    return {
        types: [
            FLOW_UPDATE_ASSIGNMENT_REQUEST,
            FLOW_UPDATE_ASSIGNMENT_SUCCESS,
            FLOW_UPDATE_ASSIGNMENT_ERROR
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

export function set_selected_assignments(assignment_ids: string[]) {
    return {
        type: FLOW_UI_SET_SELECTED_ASSIGNMENTS,
        payload: { assignment_ids }
    };
}

export function archive_assignments(assignment_ids: string[]) {
    return {
        types: [
            FLOW_ARCHIVE_ASSIGNMENT_REQUEST,
            FLOW_ARCHIVE_ASSIGNMENT_SUCCESS,
            FLOW_ARCHIVE_ASSIGNMENT_ERROR
        ],
        api: API.archive_assignments(assignment_ids),
        payload: { assignment_ids }
    };
}

export function toggle_dialog() {
    return {
        type: FLOW_UI_TOGGLE_DIALOG
    };
}

export function change_assignment(payload: any) {
    return {
        payload,
        type: FLOW_UI_CHANGE_ASSIGNMENT
    };
}

export function reset_assignment() {
    return {
        type: FLOW_UI_RESET_ASSIGNMENT
    };
}

export function sync_assignments(assignments: IAssignment[]) {
    return {
        types: [
            FLOW_SYNC_ASSIGNMENTS_REQUEST,
            FLOW_SYNC_ASSIGNMENTS_SUCCESS,
            FLOW_SYNC_ASSIGNMENTS_ERROR
        ],
        api: API.sync_assignments(assignments),
        payload: { assignments }
    };
}

export function get_assignments(assignment_ids?: string[]) {
    return {
        types: [
            FLOW_GET_ASSIGNMENTS_REQUEST,
            FLOW_GET_ASSIGNMENTS_SUCCESS,
            FLOW_GET_ASSIGNMENTS_ERROR
        ],
        api: API.get_assignments(assignment_ids),
        payload: { assignment_ids }
    };
}

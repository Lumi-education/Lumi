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
export const FLOW_UI_SELECT_ASSIGNMENT = 'FLOW_UI_SELECT_ASSIGNMENT';
export const FLOW_UI_SET_SELECTED_ASSIGNMENTS =
    ' FLOW_UI_SET_SELECTED_ASSIGNMENTS:';
export const FLOW_UI_CHANGE_ASSIGNMENT = 'FLOW_UI_CHANGE_ASSIGNMENT';
export const FLOW_UI_RESET_ASSIGNMENT = 'FLOW_UI_RESET_ASSIGNMENT';
export const FLOW_UI_OPEN_USER_ASSIGN_DIALOG =
    'FLOW_UI_OPEN_USER_ASSIGN_DIALOG';
export const FLOW_UI_CLOSE_USER_ASSIGN_DIALOG =
    'FLOW_UI_CLOSE_USER_ASSIGN_DIALOG';

import { assign as _assign } from 'lodash';
import * as API from './api';
import { IAssignment } from './types';
import { Assignment } from './models';
import * as Users from 'lib/users';
import * as Material from 'lib/material';

export function assign(
    users: Users.models.User[],
    material: Material.models.Material[]
) {
    return dispatch => {
        const assignments = [];
        const user_ids = users.map(u => u._id);
        const material_ids = material.map(m => m._id);

        user_ids.forEach(user_id => {
            material_ids.forEach(material_id => {
                assignments.push(new Assignment({ user_id, material_id }));
            });
        });

        dispatch({
            type: FLOW_ASSIGN_REQUEST,
            payload: assignments
        });

        API.create_assignments(assignments)
            .then(response => {
                const _users = users.map(u => {
                    const assignment_ids = response
                        .filter(a => a.user_id === u._id)
                        .map(a => a._id);
                    return _assign({}, u, {
                        flow: [...u.flow, ...assignment_ids]
                    });
                });
                dispatch(Users.actions.update_users(_users));
                dispatch({ type: FLOW_ASSIGN_SUCCESS, payload: response });
            })
            .catch(error => {
                dispatch({
                    type: FLOW_ASSIGN_ERROR,
                    payload: assignments
                });
            });
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
    // deprecate with universal selection module #286
    return {
        type: FLOW_UI_SELECT_ASSIGNMENT,
        payload: { assignment_id }
    };
}

export function set_selected_assignments(assignment_ids: string[]) {
    // deprecate with universal selection module #286
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

export function ui_open_user_assign_dialog() {
    return {
        type: FLOW_UI_OPEN_USER_ASSIGN_DIALOG
    };
}

export function ui_close_user_assign_dialog() {
    return {
        type: FLOW_UI_CLOSE_USER_ASSIGN_DIALOG
    };
}

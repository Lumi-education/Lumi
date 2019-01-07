import { unionBy, assign } from 'lodash';
import * as Core from 'lib/core';
import { IAssignment } from '../types';

import {
    FLOW_DELETE_ASSIGNMENT_REQUEST,
    FLOW_ARCHIVE_ASSIGNMENT_REQUEST,
    FLOW_UPDATE_ASSIGNMENT_REQUEST,
    FLOW_SAVE_STATE_REQUEST,
    FLOW_SAVE_STATE_SUCCESS,
    FLOW_SAVE_STATE_ERROR,
    FLOW_SAVE_DATA_REQUEST,
    FLOW_SAVE_DATA_SUCCESS,
    FLOW_SAVE_DATA_ERROR,
    FLOW_GET_ASSIGNMENTS_SUCCESS
} from '../actions';

const initialState: IAssignment[] = [];

export default function(
    state: IAssignment[] = initialState,
    action
): IAssignment[] {
    try {
        switch (action.type) {
            case 'DB_CHANGE':
            case FLOW_GET_ASSIGNMENTS_SUCCESS:
                return unionBy(
                    action.payload.filter(d => d.type === 'assignment'),
                    state,
                    '_id'
                ).filter(assignment => !assignment._deleted);

            case FLOW_DELETE_ASSIGNMENT_REQUEST:
                return state.filter(
                    assignment =>
                        action.assignment_ids.indexOf(assignment._id) === -1
                );

            case FLOW_UPDATE_ASSIGNMENT_REQUEST:
                return state.map(assignment =>
                    action.assignment_ids.indexOf(assignment._id) > -1
                        ? assign({}, assignment, action.update)
                        : assignment
                );

            case FLOW_ARCHIVE_ASSIGNMENT_REQUEST:
                return state.map(assignment =>
                    action.assignment_ids.indexOf(assignment._id) > -1
                        ? assign({}, assignment, { archived: true })
                        : assignment
                );

            case FLOW_SAVE_STATE_REQUEST:
                return state.map(assignment =>
                    assignment._id === action.assignment_id
                        ? assign({}, assignment, {
                              sync: 'pending',
                              state: action.state
                          })
                        : assignment
                );

            case FLOW_SAVE_DATA_REQUEST:
                return state.map(assignment =>
                    assignment._id === action.assignment_id
                        ? assign({}, assignment, {
                              sync: 'pending',
                              data: action.data,
                              score: action.data.score,
                              finished: action.data.finished,
                              state: action.data.state
                          })
                        : assignment
                );

            case FLOW_SAVE_STATE_SUCCESS:
            case FLOW_SAVE_DATA_SUCCESS:
                return state.map(assignment =>
                    assignment._id === action.assignment_id
                        ? assign({}, assignment, { sync: 'success' })
                        : assignment
                );

            case FLOW_SAVE_STATE_ERROR:
            case FLOW_SAVE_DATA_ERROR:
                return state.map(assignment =>
                    assignment._id === action.assignment_id
                        ? assign({}, assignment, { sync: 'error' })
                        : assignment
                );

            default:
                return state;
        }
    } catch (error) {
        Core.raven.captureExceoption(error);
        return state;
    }
}

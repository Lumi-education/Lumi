import { unionBy, unionWith, assign } from 'lodash';

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
    FLOW_SYNC_ASSIGNMENTS_SUCCESS,
    FLOW_SYNC_ASSIGNMENTS_REQUEST,
    FLOW_SYNC_ASSIGNMENTS_ERROR
} from '../actions';

import { USERS_GET_USER_SUCCESS } from '../../users/actions';

import * as Activity from 'lib/activity';

const initialState: IAssignment[] = [];

export default function(
    state: IAssignment[] = initialState,
    action
): IAssignment[] {
    switch (action.type) {
        case 'DB_CHANGE':
        case Activity.actions.ACTIVITY_GET_SUCCESS:
        case USERS_GET_USER_SUCCESS:
            const no_sync_ids = state
                .filter(assignment => assignment.sync === 'error')
                .map(assignment => assignment._id);

            return unionBy(
                action.payload
                    .filter(d => d.type === 'assignment')
                    .filter(
                        assignment => no_sync_ids.indexOf(assignment._id) === -1
                    ), // filter all assignment where local sync field holds the error value -> do not overwrite local data, that has not been send to the server

                state,
                '_id'
            ).filter(assignment => !assignment._deleted);

        case FLOW_SYNC_ASSIGNMENTS_SUCCESS:
            return state.map(
                assignment =>
                    action.payload.map(a => a._id).indexOf(assignment._id) > -1
                        ? assign({}, assignment, { sync: 'success' })
                        : assignment
            );

        case FLOW_SYNC_ASSIGNMENTS_REQUEST:
            return state.map(
                assignment =>
                    action.assignments.map(a => a._id).indexOf(assignment._id) >
                    -1
                        ? assign({}, assignment, { sync: 'pending' })
                        : assignment
            );

        case FLOW_SYNC_ASSIGNMENTS_ERROR:
            return state.map(
                assignment =>
                    action.assignments.map(a => a._id).indexOf(assignment._id) >
                    -1
                        ? assign({}, assignment, { sync: 'error' })
                        : assignment
            );

        case FLOW_DELETE_ASSIGNMENT_REQUEST:
            return state.filter(
                assignment =>
                    action.assignment_ids.indexOf(assignment._id) === -1
            );

        case FLOW_UPDATE_ASSIGNMENT_REQUEST:
            return state.map(
                assignment =>
                    action.assignment_ids.indexOf(assignment._id) > -1
                        ? assign({}, assignment, action.update)
                        : assignment
            );

        case FLOW_ARCHIVE_ASSIGNMENT_REQUEST:
            return state.map(
                assignment =>
                    action.assignment_ids.indexOf(assignment._id) > -1
                        ? assign({}, assignment, { archived: true })
                        : assignment
            );

        case FLOW_SAVE_STATE_REQUEST:
            return state.map(
                assignment =>
                    assignment._id === action.assignment_id
                        ? assign({}, assignment, {
                              sync: 'pending',
                              state: action.state
                          })
                        : assignment
            );

        case FLOW_SAVE_DATA_REQUEST:
            return state.map(
                assignment =>
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
            return state.map(
                assignment =>
                    assignment._id === action.assignment_id
                        ? assign({}, assignment, { sync: 'success' })
                        : assignment
            );

        case FLOW_SAVE_STATE_ERROR:
        case FLOW_SAVE_DATA_ERROR:
            return state.map(
                assignment =>
                    assignment._id === action.assignment_id
                        ? assign({}, assignment, { sync: 'error' })
                        : assignment
            );

        default:
            return state;
    }
}

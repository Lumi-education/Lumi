import { unionBy, assign } from 'lodash';

import { IAssignment } from '../types';

import {
    FLOW_DELETE_ASSIGNMENT_REQUEST,
    FLOW_ARCHIVE_ASSIGNMENT_REQUEST,
    FLOW_UPDATE_ASSIGNMENT_REQUEST
} from '../actions';

const initialState: IAssignment[] = [];

export default function(
    state: IAssignment[] = initialState,
    action
): IAssignment[] {
    switch (action.type) {
        case 'DB_CHANGE':
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

        default:
            return state;
    }
}

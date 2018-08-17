import { unionBy } from 'lodash';

import { IAssignment } from '../types';

import { FLOW_DELETE_ASSIGNMENT_REQUEST } from '../actions';

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

        default:
            return state;
    }
}

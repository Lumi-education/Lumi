import { IAssignment, IState } from './types';
import { Assignment } from './models';
import { flatten } from 'lodash';

export function assignment_for_user(
    state: IState,
    user_id: string
): Assignment[] {
    return state.flow.assignments
        .filter(assignment => assignment.user_id === user_id)
        .map(assignment => new Assignment(assignment));
}

export function assignments_for_users(
    state: IState,
    user_ids: string[]
): Assignment[] {
    return flatten(
        user_ids.map(user_id => assignment_for_user(state, user_id))
    );
}

export function assignment_by_id(
    state: IState,
    assignment_id: string
): Assignment {
    return new Assignment(
        state.flow.assignments.filter(a => a._id === assignment_id)[0]
    );
}

export function assignments_for_cards(
    state: IState,
    card_ids: string[]
): Assignment[] {
    return state.flow.assignments
        .filter(a => card_ids.indexOf(a.card_id) > -1)
        .map(assignment => new Assignment(assignment));
}

export function unsynced_assignment(state: IState): Assignment[] {
    return state.flow.assignments
        .filter(assignment => assignment.sync === 'error')
        .map(assignment => new Assignment(assignment));
}

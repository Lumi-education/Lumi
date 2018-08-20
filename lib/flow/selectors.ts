import { IAssignment, IState } from './types';
import { Assignment } from './models';

export function assignment_for_user(
    state: IState,
    user_id: string
): Assignment[] {
    return state.flow.assignments
        .filter(assignment => assignment.user_id === user_id)
        .map(assignment => new Assignment(assignment));
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

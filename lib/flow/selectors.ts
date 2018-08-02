import { IAssignment, IState } from './types';

export function assignment_for_user(
    state: IState,
    user_id: string
): IAssignment[] {
    return state.flow.assignments.filter(
        assignment => assignment.user_id === user_id
    );
}
export function assignment_by_id(
    state: IState,
    assignment_id: string
): IAssignment {
    return (
        state.flow.assignments.filter(a => a._id === assignment_id)[0] || {
            _id: null,
            card_id: null,
            user_id: null,
            type: 'assignment',
            group_id: null,
            completed: false,
            data: null,
            state: null,
            score: 0,
            time: 0
        }
    );
}

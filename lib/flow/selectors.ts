import { IState } from './types';
import { Assignment } from './models';
import { flatten } from 'lodash';

import raven from 'lib/core/raven';

export function assignment_for_user(
    state: IState,
    user_id: string
): Assignment[] {
    try {
        return state.flow.assignments
            .filter(assignment => assignment.user_id === user_id)
            .map(assignment => new Assignment(assignment));
    } catch (error) {
        raven.captureExceoption(error);
        return [];
    }
}

export function assignments_for_users(
    state: IState,
    user_ids: string[]
): Assignment[] {
    try {
        return flatten(
            user_ids.map(user_id => assignment_for_user(state, user_id))
        );
    } catch (error) {
        raven.captureExceoption(error);
        return [];
    }
}

export function assignment_by_id(
    state: IState,
    assignment_id: string
): Assignment {
    try {
        return new Assignment(
            state.flow.assignments.filter(a => a._id === assignment_id)[0]
        );
    } catch (error) {
        raven.captureExceoption(error);
        return new Assignment();
    }
}

export function assignments_for_cards(
    state: IState,
    card_ids: string[]
): Assignment[] {
    try {
        return state.flow.assignments
            .filter(a => card_ids.indexOf(a.card_id) > -1)
            .map(assignment => new Assignment(assignment));
    } catch (error) {
        raven.captureExceoption(error);
        return [];
    }
}

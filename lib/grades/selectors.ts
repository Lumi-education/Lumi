import { Map } from 'immutable';
import { IState, IGrade } from './types';

export function grades_for_user(state: IState, user_id: string): IGrade[] {
    return state.grades.map.toArray().filter(g => g.user_id === user_id);
}

export function grade(state: IState, grade_id: string): IGrade {
    return state.grades.map.get(grade_id);
}

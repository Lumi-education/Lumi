import { IState, IGrade } from './types';

export function grades_for_user(state: IState, user_id: string): IGrade[] {
    return state.grades.map.toArray().filter(g => g.user_id === user_id);
}

export function grade(state: IState, grade_id: string): IGrade {
    return state.grades.map.get(grade_id);
}

export function by_ref(state: IState, user_id: string, ref_id: string): IGrade {
    return (
        state.grades.map
            .toArray()
            .filter(g => g.ref_id === ref_id && g.user_id === user_id)[0] || {
            user_id,
            ref_id,
            _id: undefined,
            created_at: new Date(),
            updated_at: new Date(),
            _rev: undefined,
            _attachments: {},
            score: 0,
            note: '',
            type: 'grade',
            grade_type: 'Not found'
        }
    );
}

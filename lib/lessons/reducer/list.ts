import { ILesson } from '../types';
import { unionBy } from 'lodash';

import * as actions from '../actions';

export default function(state: ILesson[] = [], action): ILesson[] {
    switch (action.type) {
        // return unionBy([action.payload], state, '_id');
        case actions.LESSONS_GET_LESSONS_SUCCESS:
        case 'DB_CHANGE':
            return unionBy(
                action.payload.filter(d => d.type === 'lesson'),
                state,
                '_id'
            );

        default:
            return state;
    }
}

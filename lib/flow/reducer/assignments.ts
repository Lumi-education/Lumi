import { unionBy } from 'lodash';

import { IAssignment } from '../types';

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
            );

        default:
            return state;
    }
}

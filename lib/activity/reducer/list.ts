import { unionBy } from 'lodash';

import { IActivity } from '../types';
import * as actions from '../actions';

export default function(state: IActivity[] = [], action): IActivity[] {
    switch (action.type) {
        case actions.ACTIVITY_GET_SUCCESS:
        case 'DB_CHANGE':
            return unionBy(
                action.payload.filter(d => d.type === 'activity'),
                state,
                '_id'
            );

        default:
            return state;
    }
}

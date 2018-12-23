import { IGroup } from '../types';
import { assign, unionBy } from 'lodash';

import { GROUPS_CREATE_SUCCESS, GROUPS_DELETE_SUCCESS } from '../actions';

export default function(state: IGroup[] = [], action): IGroup[] {
    switch (action.type) {
        case GROUPS_DELETE_SUCCESS:
            return state.filter(group => group._id !== action.group_id);

        case 'DB_CHANGE':
        case 'CORE_UPDATE_DB_SUCCESS':
        case 'CORE_CREATE_DB_SUCCESS':
        case GROUPS_CREATE_SUCCESS:
            return unionBy(
                action.payload.filter(d => d.type === 'group'),
                state,
                '_id'
            );

        default:
            return state;
    }
}

import { assign, unionBy } from 'lodash';

import { ISession }        from 'lib/types';

import { USER_INIT_SUCCESS } from '../../action-types';

export default function(state: ISession[] = [], action): ISession[] {
    switch (action.type) {
        case USER_INIT_SUCCESS:
            return unionBy(
                action.payload.filter(d => d.type === 'session'),
                state,
                '_id'
            );

        default:
            return state;
    }
}

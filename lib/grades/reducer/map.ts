import { assign, unionBy } from 'lodash';

import { Map } from 'immutable';

import { IGrade } from '../types';

import { arrayToObject } from 'lib/core/utils';

import { GRADES_GET_USER_GRADES_SUCCESS } from '../actions';

export default function(
    state: Map<string, IGrade> = Map<string, IGrade>({}),
    action
): Map<string, IGrade> {
    switch (action.type) {
        case GRADES_GET_USER_GRADES_SUCCESS:
            return state.merge(
                Map<string, IGrade>(
                    arrayToObject(
                        action.payload.filter(d => d.type === 'grade')
                    )
                )
            );

        default:
            return state;
    }
}

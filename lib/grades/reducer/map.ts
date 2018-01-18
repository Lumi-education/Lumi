import { assign, unionBy } from 'lodash';

import { Map } from 'immutable';

import { IGrade } from '../types';

import { arrayToObject } from 'lib/core/utils';

import {
    GRADES_GET_USER_GRADES_SUCCESS,
    GRADES_CREATE_GRADE_SUCCESS,
    GRADES_DELETE_GRADE_REQUEST
} from '../actions';

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

        case GRADES_CREATE_GRADE_SUCCESS:
            const o = {};
            o[action.payload._id] = action.payload;
            return state.merge(Map<string, IGrade>(o));

        case GRADES_DELETE_GRADE_REQUEST:
            return state.delete(action.payload.grade_id);

        default:
            return state;
    }
}

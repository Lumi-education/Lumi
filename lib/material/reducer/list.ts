import { IMaterial } from '../types';
import { unionBy, assign } from 'lodash';

import { MATERIAL_CREATE_SUCCESS, MATERIAL_DELETE_REQUEST } from '../actions';

import * as Core from 'lib/core';

export default function(state: IMaterial[] = [], action): IMaterial[] {
    switch (action.type) {
        case 'DB_CHANGE':
        case MATERIAL_CREATE_SUCCESS:
            return unionBy(
                action.payload.filter(d => d.type === 'material'),
                state,
                '_id'
            ).filter(material => !material._deleted);

        case MATERIAL_DELETE_REQUEST:
            return state.filter(
                material => material._id !== action.payload.material_id
            );

        default:
            return state;
    }
}

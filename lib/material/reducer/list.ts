import { IMaterial } from '../types';
import { unionBy, assign } from 'lodash';

import {
    MATERIAL_CREATE_SUCCESS,
    MATERIAL_DELETE_REQUEST,
    MATERIAL_GET_SUCCESS,
    MATERIAL_FIND_SUCCESS,
    MATERIAL_UPLOAD_H5P_SUCCESS
} from '../actions';

export default function(state: IMaterial[] = [], action): IMaterial[] {
    switch (action.type) {
        case MATERIAL_GET_SUCCESS:
        case 'DB_CHANGE':
        case MATERIAL_CREATE_SUCCESS:
            return unionBy(
                action.payload.filter(d => d.type === 'material'),
                state,
                '_id'
            ).filter(material => !material._deleted);

        case MATERIAL_FIND_SUCCESS:
            return unionBy(action.payload.docs, state, '_id');

        case MATERIAL_UPLOAD_H5P_SUCCESS:
            return unionBy([action.payload], state, '_id');

        case MATERIAL_DELETE_REQUEST:
            return state.filter(
                material => material._id !== action.payload.material_id
            );

        default:
            return state;
    }
}

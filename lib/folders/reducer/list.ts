import { IFolder } from '../types';
import { unionBy } from 'lodash';

import * as actions from '../actions';

export default function(state: IFolder[] = [], action): IFolder[] {
    switch (action.type) {
        case actions.FOLDERS_CREATE_FOLDER_SUCCESS:
        case actions.FOLDERS_GET_FOLDERS_SUCCESS:
        case actions.FOLDERS_ADD_MATERIAL_SUCCESS:
        case 'DB_CHANGE':
            return unionBy(
                action.payload.filter(d => d.type === 'folder'),
                state,
                '_id'
            );

        default:
            return state;
    }
}

import { assign, unionBy } from 'lodash';

import { IFolderUI } from '../types';

import { FOLDER_SELECT_FOLDER } from '../actions';

const initialState: IFolderUI = {
    selected_folder: 'root_folder'
};

export default function(state: IFolderUI = initialState, action): IFolderUI {
    switch (action.type) {
        case FOLDER_SELECT_FOLDER:
            return assign({}, state, { selected_folder: action.folder_id });
        default:
            return state;
    }
}

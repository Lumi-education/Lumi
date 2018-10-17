export const FOLDERS_CREATE_FOLDER_REQUEST = 'FOLDERS_CREATE_FOLDER_REQUEST';
export const FOLDERS_CREATE_FOLDER_SUCCESS = 'FOLDERS_CREATE_FOLDER_SUCCESS';
export const FOLDERS_CREATE_FOLDER_ERROR = 'FOLDERS_CREATE_FOLDER_ERROR';

export const FOLDERS_GET_FOLDERS_REQUEST = 'FOLDERS_GET_FOLDERS_REQUEST';
export const FOLDERS_GET_FOLDERS_SUCCESS = 'FOLDERS_GET_FOLDERS_SUCCESS';
export const FOLDERS_GET_FOLDERS_ERROR = 'FOLDERS_GET_FOLDERS_ERROR';

export const FOLDERS_ADD_MATERIAL_REQUEST = 'FOLDERS_ADD_MATERIAL_REQUEST';
export const FOLDERS_ADD_MATERIAL_SUCCESS = 'FOLDERS_ADD_MATERIAL_SUCCESS';
export const FOLDERS_ADD_MATERIAL_ERROR = 'FOLDERS_ADD_MATERIAL_ERROR';

export const FOLDER_SELECT_FOLDER = 'FOLDERS_SELECT_FOLDER';

import * as API from './api';

export function create_folder(name: string, in_folder: string) {
    return {
        types: [
            FOLDERS_CREATE_FOLDER_REQUEST,
            FOLDERS_CREATE_FOLDER_SUCCESS,
            FOLDERS_CREATE_FOLDER_ERROR
        ],
        api: API.create_folder(name, in_folder),
        payload: { payload: { name, in_folder } }
    };
}

export function get_folders() {
    return {
        types: [
            FOLDERS_GET_FOLDERS_REQUEST,
            FOLDERS_GET_FOLDERS_SUCCESS,
            FOLDERS_GET_FOLDERS_ERROR
        ],
        api: API.get_folders(),
        payload: {}
    };
}

export function add_material(folder_id: string, _ids: string[]) {
    return {
        types: [
            FOLDERS_ADD_MATERIAL_REQUEST,
            FOLDERS_ADD_MATERIAL_SUCCESS,
            FOLDERS_ADD_MATERIAL_ERROR
        ],
        api: API.add_material(folder_id, _ids),
        payload: { payload: { folder_id, _ids } }
    };
}

export function select_folder(folder_id: string) {
    return {
        folder_id,
        type: FOLDER_SELECT_FOLDER
    };
}

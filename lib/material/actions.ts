export const MATERIAL_CREATE_REQUEST = 'MATERIAL_CREATE_REQUEST';
export const MATERIAL_CREATE_SUCCESS = 'MATERIAL_CREATE_SUCCESS';
export const MATERIAL_CREATE_ERROR = 'MATERIAL_CREATE_ERROR';

export const MATERIAL_GET_REQUEST = 'MATERIAL_GET_REQUEST';
export const MATERIAL_GET_SUCCESS = 'MATERIAL_GET_SUCCESS';
export const MATERIAL_GET_ERROR = 'MATERIAL_GET_ERROR';

export const MATERIAL_FIND_REQUEST = 'MATERIAL_FIND_REQUEST';
export const MATERIAL_FIND_SUCCESS = 'MATERIAL_FIND_SUCCESS';
export const MATERIAL_FIND_ERROR = 'MATERIAL_FIND_ERROR';

export const MATERIAL_DELETE_REQUEST = 'MATERIAL_DELETE_REQUEST';
export const MATERIAL_DELETE_SUCCESS = 'MATERIAL_DELETE_SUCCESS';
export const MATERIAL_DELETE_ERROR = 'MATERIAL_DELETE_ERROR';

export const MATERIAL_UPDATE_REQUEST = 'MATERIAL_UPDATE_REQUEST';
export const MATERIAL_UPDATE_SUCCESS = 'MATERIAL_UPDATE_SUCCESS';
export const MATERIAL_UPDATE_ERROR = 'MATERIAL_UPDATE_ERROR';

export const MATERIAL_UPLOAD_H5P_REQUEST = 'MATERIAL_UPLOAD_REQUEST';
export const MATERIAL_UPLOAD_H5P_SUCCESS = 'MATERIAL_UPLOAD_SUCCESS';
export const MATERIAL_UPLOAD_H5P_ERROR = 'MATERIAL_UPLOAD_ERROR';

export const MATERIAL_SELECT = 'MATERIAL_SELECT';
export const MATERIAL_SELECTION_RESET = 'MATERIAL_SELECTION_RESET';
export const MATERIAL_UI_CHANGE_MATERIAL = 'MATERIAL_UI_CHANGE_MATERIAL';
export const MATERIAL_UI_RESET_MATERIAL = 'MATERIAL_UI_RESET_MATERIAL';
export const MATERIAL_UI_SET_SELECTED_MATERIAL =
    'MATERIAL_UI_SET_SELECTED_MATERIAL';
export const MATERIAL_ADD_MATERIAL_TO_SELECTION =
    'MATERIAL_ADD_MATERIAL_TO_SELECTION';
export const MATERIAL_REMOVE_MATERIAL_FROM_SELECTION =
    'MATERIAL_REMOVE_MATERIAL_FROM_SELECTION';
export const MATERIAL_UI_SET_MATERIAL = 'MATERIAL_UI_SET_MATERIAL';

export const MATERIAL_UI_RESET_BOOKMARK = 'MATERIAL_UI_RESET_BOOKMAR';

import * as debug from 'debug';
import { Material } from './models';
import * as api from './api';
import { IMaterial } from './types';

const log_info = debug('lumi:info:material:actions');

export function create(material?: Material) {
    const _material = material || new Material();

    _material.index = JSON.stringify(_material)
        .replace(/[^a-zA-Z0-9 -]/g, '')
        .toLowerCase();

    return {
        types: [
            MATERIAL_CREATE_REQUEST,
            MATERIAL_CREATE_SUCCESS,
            MATERIAL_CREATE_ERROR
        ],
        api: api.create(_material),
        payload: [_material]
    };
}

export function get(_ids: string[]) {
    return {
        types: [
            MATERIAL_CREATE_REQUEST,
            MATERIAL_CREATE_SUCCESS,
            MATERIAL_CREATE_ERROR
        ],
        api: api.get(_ids),
        payload: _ids
    };
}

export function find(query) {
    return {
        types: [
            MATERIAL_FIND_REQUEST,
            MATERIAL_FIND_SUCCESS,
            MATERIAL_FIND_ERROR
        ],
        api: api.find(query),
        payload: query
    };
}

export function update(material: IMaterial) {
    material.index = JSON.stringify(material)
        .replace(/[^a-zA-Z0-9 -]/g, '')
        .toLowerCase();

    return {
        types: [
            MATERIAL_UPDATE_REQUEST,
            MATERIAL_UPDATE_SUCCESS,
            MATERIAL_UPDATE_ERROR
        ],
        api: api.update(material),
        payload: [material]
    };
}

export function destroy(material_id: string) {
    return {
        types: [
            MATERIAL_DELETE_REQUEST,
            MATERIAL_DELETE_SUCCESS,
            MATERIAL_DELETE_ERROR
        ],
        api: api.destroy(material_id),
        payload: { material_id }
    };
}

export function upload_h5p(material_id: string, h5p_file: FormData) {
    log_info('upload_h5p', material_id, h5p_file);
    return {
        types: [
            MATERIAL_UPLOAD_H5P_REQUEST,
            MATERIAL_UPLOAD_H5P_SUCCESS,
            MATERIAL_UPLOAD_H5P_ERROR
        ],
        api: api.upload_h5p(material_id, h5p_file),
        payload: h5p_file
    };
}

export function change(payload: any) {
    return {
        payload,
        type: MATERIAL_UI_CHANGE_MATERIAL
    };
}

export function ui_set_material(material: IMaterial) {
    return {
        type: MATERIAL_UI_SET_MATERIAL,
        payload: material
    };
}

export function ui_reset_material() {
    return {
        type: MATERIAL_UI_RESET_MATERIAL
    };
}

export function add_material_to_selection(material_id: string, index?: number) {
    return {
        material_id,
        index,
        type: MATERIAL_ADD_MATERIAL_TO_SELECTION
    };
}
export function remove_material_from_selection(material_id: string) {
    return {
        material_id,
        type: MATERIAL_REMOVE_MATERIAL_FROM_SELECTION
    };
}

export function set_selected_material(material_ids: string[]) {
    return {
        material_ids,
        type: MATERIAL_UI_SET_SELECTED_MATERIAL
    };
}

export function ui_reset_bookmark() {
    return {
        type: MATERIAL_UI_RESET_BOOKMARK
    };
}

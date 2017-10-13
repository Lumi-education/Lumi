import {
	Material,
	MaterialMeta,
}		from './types';

import { assign } from 'lodash';
import * as shortid from 'shortid';

import * as API from './api';

import {
	MATERIAL_CREATE_META_ERROR,
	MATERIAL_CREATE_META_REQUEST,
	MATERIAL_CREATE_META_SUCCESS,

	MATERIAL_GET_SUCCESS,
	MATERIAL_META_GET_ERROR,
	MATERIAL_META_GET_REQUEST,

	MATERIAL_META_GET_SUCCESS,
	MATERIAL_UPDATE_META_ERROR,
	MATERIAL_UPDATE_META_REQUEST,

	MATERIAL_UPDATE_META_SUCCESS,
} from '../action-types';

export function material_meta_update(material_meta_id: string, update: Object) {
	return {
		types: [MATERIAL_UPDATE_META_REQUEST, MATERIAL_UPDATE_META_SUCCESS, MATERIAL_UPDATE_META_ERROR],
		api: API.update_material_meta(material_meta_id, update),
		payload: { payload: { update, material_meta_id } }
	};
}

export function create_material_meta(material_meta: MaterialMeta, id: string = shortid()) {
	return {
		types: [MATERIAL_CREATE_META_REQUEST, MATERIAL_CREATE_META_SUCCESS, MATERIAL_CREATE_META_ERROR],
		api: API.create_material_meta(material_meta),
		payload: { id, payload: material_meta }
	};
}
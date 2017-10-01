import {
	Material,
	MaterialMeta,
 }		from "./types";

import { assign } from "lodash";
import * as shortid from "shortid";

import * as _API from "lib/api";
import * as MATERIAL_API from "./api";

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
} from "./constants";

export function material_get(material_id: string) {
	return (dispatch) => {
		MATERIAL_API.material_get(material_id)
		.then((res) =>  {
			switch (res.status) {
				case 200:
					dispatch({ type: MATERIAL_GET_SUCCESS, payload: res.body.docs });
				 break;
				default:
			}
		})
		.catch((err) => { });
	};
}

export function material_meta_update(material_meta: MaterialMeta, update: Object) {
	return (dispatch) => {
		dispatch({ type: MATERIAL_UPDATE_META_REQUEST, payload: { material_meta, update }});

		_API
		.update("lumidb", material_meta._id, assign({}, material_meta, update))
		.then((res) => {
			switch (res.status) {
				case 200:
				case 201:
					dispatch({ type: MATERIAL_UPDATE_META_SUCCESS, payload: res.body });
				 break;
				default:
					dispatch({ type: MATERIAL_UPDATE_META_ERROR, payload: { status: res.status }});
			}
		});
	};
}

export function material_meta_get_or_create(material_meta: MaterialMeta, id: string = shortid()) {
	return (dispatch) => {

			dispatch({ type: MATERIAL_META_GET_REQUEST, id, payload: { material_meta }});

			MATERIAL_API.material_meta_get(material_meta.material_id, material_meta.query, material_meta.user_id)
			.then((res) => {
				if (res.body.docs.length != 0) {
					dispatch({ type: MATERIAL_META_GET_SUCCESS, id, payload: res.body.docs });
				} else {
					// dispatch({ type: MATERIAL_META_GET_ERROR, id });
					dispatch(create_material_meta(material_meta.user_id, material_meta, id));
				}

			})
			.catch();
	};
}

export function create_material_meta(user_id: string, material_meta: MaterialMeta, id: string = shortid()) {
	return (dispatch) => {

		dispatch({ type: MATERIAL_CREATE_META_REQUEST, id, payload: { material_meta }});

		_API
		.create("lumidb", material_meta)
		.then((res) => {
			switch (res.status) {
				case 200:
				case 201:
					dispatch({ type: MATERIAL_CREATE_META_SUCCESS, id, payload: assign({}, material_meta, { _rev: res.body.rev, _id: res.body.id }) });
				 break;
				default:
					dispatch({ type: MATERIAL_CREATE_META_ERROR, id, payload: { res }});
			}
		});
	};
}

export function material_meta_get(material_id: string, query: Object, user_id?: string, id: string = shortid()) {
	return (dispatch) => {
				dispatch({ type: MATERIAL_META_GET_REQUEST, id, payload: { material_id, query } });

				MATERIAL_API.material_meta_get(material_id, query, user_id)
				.then((res) => {
					if (res.body.docs.length != 0) {
						dispatch({ type: MATERIAL_META_GET_SUCCESS, payload: res.body.docs });
					} else {
						dispatch({ type: MATERIAL_META_GET_ERROR, payload: { material_id, query, user_id }});
					}

				})
				.catch();
		};
}

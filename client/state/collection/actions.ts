import * as shortid from 'shortid';

import {
	Collection,
	CollectionMeta,
 } 	from './types';

import * as API from './api';

import {
	COLLECTION_CREATEMETA_ERROR,
	COLLECTION_CREATEMETA_REQUEST,
	COLLECTION_CREATEMETA_SUCCESS,

	COLLECTION_GET_ERROR,
	COLLECTION_GET_REQUEST,
	COLLECTION_GET_SUCCESS,

	COLLECTION_SUBMIT_ERROR,
	COLLECTION_SUBMIT_REQUEST,
	COLLECTION_SUBMIT_SUCCESS

}							from '../action-types';

export function get_collections() {
	return {
		types: [COLLECTION_GET_REQUEST, COLLECTION_GET_SUCCESS, COLLECTION_GET_ERROR],
		api: API.get_collections()
	};
}

// export function collection_userdata_update(user_id: string, update: Collection) {
// 	return (dispatch) => {

// 		API_v0.update(user_id, update._id, update)
// 		.then((res) =>  {
// 			switch (res.status) {
// 				case 200:
// 					dispatch({ type: k.COLLECTION_UPDATE_SUCCESS, payload: res.body });
// 				 break;
// 				default:
// 					// dispatch({ type: k.COLLECTION_GET_ERROR });
// 			}
// 		})
// 		.catch((err) => { });
// 	};
// }

export function collection_create_meta(collection_id: string, id: string = shortid()) {
	return {
		types: [COLLECTION_CREATEMETA_REQUEST, COLLECTION_CREATEMETA_SUCCESS, COLLECTION_CREATEMETA_ERROR],
		api: API.post_collectionmeta(collection_id),
		payload: { id, collection_id }
	};
	// return (dispatch) => {

	// 	dispatch({ type: COLLECTION_CREATEMETA_REQUEST, id, payload: { collection_id }});

	// 	API
	// 	.post_collectionmeta(collection_id)
	// 	.then((res) => {
	// 		switch (res.status) {
	// 			case 200:
	// 			case 201:
	// 				dispatch({ type: COLLECTION_CREATEMETA_SUCCESS, id, payload: res.body });
	// 			 break;
	// 			default:
	// 				dispatch({ type: COLLECTION_CREATEMETA_ERROR, id, payload: { res }});
	// 		}
	// 	});
	// };
}

export function submit_collection(collection_meta_id: string, id: string = shortid()) {
	return {
		types: [COLLECTION_SUBMIT_REQUEST, COLLECTION_SUBMIT_SUCCESS, COLLECTION_SUBMIT_ERROR],
		api: API.submit_collection(collection_meta_id)
	};
}

import { assign } 		from 'lodash';

import {
	SESSION_GET_SESSION_ID_SUCCESS,
} from '../action-types';

import * as API from './api';

export function session_update(update: Object) {
	return (dispatch) => {

				API.session_update(update)
				.then((res) =>  {
					switch (res.status) {
						case 200:
							// dispatch({ type: SESSION_GET_SESSION_ID_SUCCESS, payload: res.body });
						break;
						default:
					}
				})
				.catch();
			};
}

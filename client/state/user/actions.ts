import * as API from './api';

import {
	USER_INIT_REQUEST,
	USER_INIT_SUCCESS,
	USER_INIT_ERROR
} from '../action-types';

export function init() {
	return {
		types: [USER_INIT_REQUEST, USER_INIT_SUCCESS, USER_INIT_ERROR],
		api: API.init()
	};
}

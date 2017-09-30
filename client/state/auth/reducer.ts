import {
	assign,
	unionBy,
 } 		from 'lodash';

import { Auth } from './types';

import {
	Action,
	AUTH_GET_SESSION_SUCCESS,
} from '../action-types';

const initialState: Auth = {
	is_authed: false
};

export default function(state: Auth = initialState, action: Action): Auth {
	switch (action.type) {

		case AUTH_GET_SESSION_SUCCESS:
			return assign({}, state, { is_authed: true });

		case '@@INIT':
			return initialState;

		default:
			return state;
	}
}

import * as request from 'superagent';
import { assign } 	from 'lodash';
declare var window;

export function init() {
	return request
	.get('/api/user')
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}
import * as request from 'superagent';
declare var window;

export function get_tags() {
	return request
	.get('/api/v0/tags')
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}
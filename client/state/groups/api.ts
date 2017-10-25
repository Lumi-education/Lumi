import * as request from 'superagent';
declare var window;

export function create_group(name: string) {
	return request
	.post('/api/v0/groups')
	.send({ name })
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}

export function get_groups() {
	return request
	.get('/api/v0/groups')
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}
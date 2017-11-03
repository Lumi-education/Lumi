import * as request from 'superagent';
declare var window;

export function create_tag(name: string, description?: string) {
	return request
	.post('/api/v0/tags')
	.send({ name, description })
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}

export function delete_tag(tag_id: string) {
	return request
	.delete('/api/v0/tags/' + tag_id )
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}

export function get_tags() {
	return request
	.get('/api/v0/tags')
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}
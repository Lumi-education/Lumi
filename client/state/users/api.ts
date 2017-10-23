import * as request from 'superagent';
declare var window;

import { IUser } 	from 'lib/types';

export function create_user(user: IUser) {
	return request
	.post('/api/v0/users')
	.send( user )
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}

export function get_users() {
	return request
	.get('/api/v0/users')
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}

export function get_user(user_id: string) {
	return request
	.get('/api/v0/users/' + user_id )
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}

export function delete_user(user_id: string) {
	return request
	.delete('/api/v0/users/' + user_id )
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}
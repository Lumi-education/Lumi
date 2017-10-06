import * as request from 'superagent';

declare var window;

export function login(username: string, password: string) {
	return request
	.post('/api/user/auth/login')
	.send({ username, password })
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');
}

export function logout() {
	return request
	.post('/api/user/auth/logout')
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');
}

export function register(username: string, password: string) {
	return request
	.post('/api/user/auth/register')
	.send({ username, password });
}

export function get_session() {
	return request
	.get('/api/user/auth/session')
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');
}

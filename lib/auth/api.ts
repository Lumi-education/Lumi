import * as request from 'superagent';

declare var window;

export function login(username: string, password: string) {
    return request
        .post('/api/v0/auth/login')
        .send({ username, password })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function logout() {
    return request
        .post('/api/v0/auth/logout')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function register(username: string, password: string) {
    return request.post('/api/v0/auth/register').send({ username, password });
}

export function get_session() {
    return request
        .get('/api/v0/user/auth/session')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function set_password(username: string, password: string) {
    return request
        .post('/api/v0/auth/password/')
        .send({
            username,
            password
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

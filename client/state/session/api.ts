import * as request from 'superagent';

declare var window;

export function get_session_id() {
    return request
        .get('/api/user/auth/session_id')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function session_update(update) {
    return request
        .put('/api/user/auth/session')
        .send(update)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

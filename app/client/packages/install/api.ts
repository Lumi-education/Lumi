import * as request from 'superagent';
declare var window;

export function get_install() {
    return request
        .get('/api/v0/install')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

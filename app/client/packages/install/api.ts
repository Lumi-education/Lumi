import * as request from 'superagent';
declare var window;

export function get_install() {
    return request
        .get('/api/v0/' + window.location.pathname.split('/')[1] + '/install')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

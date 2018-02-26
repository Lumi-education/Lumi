import * as request from 'superagent';
declare var window;

export function shutdown() {
    return request
        .post('/api/v0/system/shutdown')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

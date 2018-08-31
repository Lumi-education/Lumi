import * as request from 'superagent';

declare var window;

export function find(query, options?) {
    return request
        .post('/api/v0/core/find')
        .send({ options, selector: query })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function doc(id: string) {
    return request
        .get('/api/v0/core/doc/' + id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update(ids: string[], _update) {
    return request
        .post('/api/v0/core/update?ids=' + JSON.stringify(ids))
        .send(_update)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function action(_action: string, ids: string[], payload) {
    return request
        .post('/api/v0/core/action/' + _action + '?ids=' + JSON.stringify(ids))
        .send(payload)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function shutdown() {
    return request
        .post('/api/v0/system/shutdown')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_settings() {
    return request
        .get('/api/v0/system/settings')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function ping() {
    return request
        .get('/api/v0/core/ping')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

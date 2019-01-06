import * as request from 'superagent';
import { assign } from 'lodash';

declare var window;

export function find(query, options?) {
    return request
        .post('/api/v0/core/find')
        .send({ options, selector: query })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function shutdown() {
    return request
        .post('/api/v0/core/shutdown')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_settings() {
    return request.get(
        '/api/v1/' + window.location.pathname.split('/')[1] + '/core'
    );
}

export function ping() {
    return request
        .get('/api/v0/core/ping')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function env() {
    return request
        .get('/api/v0/core/env')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_env(_env) {
    return request
        .put('/api/v0/core/env')
        .send(_env)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function check_update() {
    return request
        .get('/api/v0/core/check_update')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_system() {
    return request
        .post('/api/v0/core/update_system')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function init_db(payload: any) {
    return request
        .post('/api/v1/' + window.location.pathname.split('/')[1] + '/core')
        .send(payload)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

import * as request from 'superagent';
import { assign } from 'lodash';
declare var window;

export function create_user(name: string, options?) {
    return request
        .post('/api/v0/users')
        .send(assign({}, { name }, options))
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_users(user_ids?: string[]) {
    return request
        .get(
            '/api/v0/users' +
                (user_ids ? '?user_ids=' + JSON.stringify(user_ids) : '')
        )
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_user(user_id: string) {
    return request
        .get('/api/v0/users/' + user_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function delete_user(user_ids: string[]) {
    return request
        .delete('/api/v0/users')
        .send({ user_ids })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_user(user_id: string, update) {
    return request
        .put('/api/v0/users/' + user_id)
        .send(update)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function init_user() {
    return request
        .get('/api/v0/user')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_myself(update) {
    return request
        .put('/api/v0/user')
        .send(update)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

import * as request from 'superagent';
import { assign } from 'lodash';
declare var window;

import { IUser } from './types';

export function create_user(name: string, options?) {
    return request
        .post('/api/v0/users')
        .send(assign({}, { name }, options))
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_users() {
    return request
        .get('/api/v0/users?limit=100')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_user(user_id: string) {
    return request
        .get('/api/v0/users/' + user_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function delete_user(user_id: string) {
    return request
        .delete('/api/v0/users/' + user_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_user(user_id: string, update) {
    return request
        .put('/api/v0/users/' + user_id)
        .send(update)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function init(user_id: string) {
    return request
        .get('/api/v0/users/' + user_id + '/init')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

import * as request from 'superagent';
import { assign } from 'lodash';
declare var window;

import { IUser } from 'common/types';

export function add_group(user_id: string, group_id: string) {
    return request
        .put('/api/v0/users/' + user_id + '/action')
        .send({
            type: 'ADD_GROUP',
            payload: { group_id }
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function rem_group(user_id: string, group_id: string) {
    return request
        .put('/api/v0/users/' + user_id + '/action')
        .send({
            type: 'REM_GROUP',
            payload: { group_id }
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function create_user(name: string, options?) {
    return request
        .post('/api/v0/users')
        .send(assign({}, { name }, options))
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_users() {
    return request
        .get('/api/v0/users')
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

import * as request from 'superagent';
import { assign } from 'lodash';
declare var window;

import { User } from './models';
import * as core from 'lib/core';

export function create_users(users: User[]): Promise<User[]> {
    return core.api.batch_create<User>(users).then(created_users => {
        return core.db.get('_design/user').then(_design => {
            let design = _design;
            created_users.forEach(
                user => (design = add_view_to_user(design, user._id))
            );

            return core.db.put(design).then(update_design => {
                return created_users;
            });
        });
    });
    // return request
    //     .post('/api/v0/users')
    //     .send(assign({}, { name }, options))
    //     .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
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

function add_view_to_user(_design, user_id: string) {
    const new_view = {};
    new_view[user_id] = {
        map: "function (doc) {\n  if (doc.user_id === '__USERID__') { \n    emit('__USERID__', 1); \n    if (doc.type === 'assignment') { emit('__USERID__', { _id: doc.card_id }) }\n  }\n  if (doc.type === 'user' && doc._id === '__USERID__') {\n    emit('__USERID__', 1);\n    doc.groups.forEach(function(group_id)  { emit('__USERID__', {_id: group_id })} );\n  }\n}".replace(
            /__USERID__/g,
            user_id
        )
    };
    const views = assign({}, _design.views, new_view);

    _design.views = views;
    return _design;
}

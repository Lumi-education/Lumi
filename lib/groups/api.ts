import * as request from 'superagent';
import db from 'client/store/pouchdb';
declare var window;

import { IGroup } from './types';
import { assign } from 'lib/flow/api';

export function create_group(group: IGroup): Promise<IGroup> {
    return db.post(group);
    // return request
    //     .post('/api/v0/groups')
    //     .send({ name })
    //     .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function delete_group(_id: string) {
    return request
        .delete('/api/v0/groups/' + _id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_groups() {
    return request
        .get('/api/v0/groups')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_group(group_id: string) {
    return request
        .get('/api/v0/groups/' + group_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_user_groups(user_id: string) {
    return request
        .get('/api/v0/groups/user/' + user_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function assign_groups(user_ids: string[], group_ids: string[]) {
    return request
        .put('/api/v0/groups/assign')
        .send({
            user_ids,
            group_ids
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function remove_users_from_groups(
    user_ids: string[],
    group_ids: string[]
) {
    return request
        .put('/api/v0/groups/remove_users_from_groups')
        .send({
            user_ids,
            group_ids
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}
export function update_group<T>(group_id: string, update): Promise<T> {
    // return db.get(group_id).then(group => {
    // assign(group, update);
    return db.put(update);
    // });
    // return request
    //     .put('/api/v0/groups/' + group_id)
    //     .send(update)
    //     .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}
export function add_cards(group_id: string, card_ids: string[]) {
    return request
        .put('/api/v0/groups/' + group_id + '/cards')
        .send({ group_id, card_ids })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

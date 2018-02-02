import * as request from 'superagent';
import { assign } from 'lodash';
import * as qs from 'query-string';

declare var window;

export function create_data(data) {
    return request
        .post('/api/v0/user/data')
        .send(data)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_data(data) {
    return request
        .put('/api/v0/user/data/' + data._id)
        .send(data)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_data(query) {
    return request
        .get('/api/v0/data?' + qs.stringify(query))
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_card_data(
    user_id: string,
    collection_id: string,
    card_id: string
) {
    return request
        .get('/api/v0/data/' + user_id + '-' + collection_id + '-' + card_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_user_collection_data(collection_id: string) {
    return request
        .get('/api/v0/user/data/collections/' + collection_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

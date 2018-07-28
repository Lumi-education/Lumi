import * as request from 'superagent';
import {assign} from 'lodash';
declare var window;

export function get_cards(_ids?: string[]) {
    return request
        .get('/api/v0/cards' + (_ids ? '?_ids=' + JSON.stringify(_ids) : ''))
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_card(card_id: string) {
    return request
        .get('/api/v0/cards/' + card_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_card(card_id: string, update) {
    return request
        .put('/api/v0/cards/' + card_id)
        .send(update)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function create_card(card?) {
    return request
        .post('/api/v0/cards')
        .send(card)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function delete_card(card_id: string) {
    return request
        .delete('/api/v0/cards/' + card_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function create_data(data) {
    return request
        .post('/api/v0/user/data')
        .send(data)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_data(data) {
    return request
        .put('/api/v0/user/data/' + data._id)
        .send(assign(data, {processed: true}))
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

export function get_h5p(content_id: string) {
    return request
        .get('/api/v0/cards/h5p/' + content_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

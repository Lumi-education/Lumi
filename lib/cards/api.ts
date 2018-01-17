import * as request from 'superagent';
import { assign } from 'lodash';
declare var window;

export function get_cards(_ids?: string[]) {
    return request
        .get(
            '/api/v0/' +
                window.location.pathname.split('/')[1] +
                '/cards' +
                (_ids ? '?_ids=' + JSON.stringify(_ids) : '')
        )
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_card(card_id: string) {
    return request
        .get(
            '/api/v0/' +
                window.location.pathname.split('/')[1] +
                '/cards/' +
                card_id
        )
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_card(card_id: string, update) {
    return request
        .put(
            '/api/v0/' +
                window.location.pathname.split('/')[1] +
                '/cards/' +
                card_id
        )
        .send(update)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function create_card(card?) {
    return request
        .post('/api/v0/' + window.location.pathname.split('/')[1] + '/cards')
        .send(card)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function delete_card(card_id: string) {
    return request
        .delete(
            '/api/v0/' +
                window.location.pathname.split('/')[1] +
                '/cards/' +
                card_id
        )
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

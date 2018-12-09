import * as request from 'superagent';
import * as qs from 'query-string';
import { assign } from 'lodash';

declare var window;

// const request = _request.set(
//     'x-auth',
//     window.localStorage.jwt_token || window.jwt_token || ''
// );

const db = 'lumi';

export function get_cards(_ids?: string[], options?) {
    return request
        .get(
            `/api/v1/${db}/_design/cards/_view/index?${qs.stringify(
                assign({ keys: _ids, include_docs: true }, options)
            )}`
        )
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
    return request.delete('/api/v0/cards/' + card_id);
}

export function duplicate(card_id: string) {
    return request
        .post('/api/v0/cards/' + card_id + '/duplicate')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

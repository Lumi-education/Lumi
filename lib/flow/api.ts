import * as request from 'superagent';

declare var window;

export function assign(group_id : string, user_ids : string[], card_ids : string[]) {
    return request
        .post('/api/v0/flow/assign')
        .send({group_id, user_ids, card_ids})
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}
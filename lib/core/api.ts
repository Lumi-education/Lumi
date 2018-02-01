import * as request from 'superagent';
import { assign } from 'lodash';

declare var window;

export function find(query) {
    return request
        .post(
            '/api/v0/' + window.location.pathname.split('/')[1] + '/core/find'
        )
        .send({ selector: query })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update(ids: string[], _update) {
    return request
        .post(
            '/api/v0/' +
                window.location.pathname.split('/')[1] +
                '/core/update?ids=' +
                JSON.stringify(ids)
        )
        .send(_update)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function action(_action: string, ids: string[], payload) {
    return request
        .post(
            '/api/v0/' +
                window.location.pathname.split('/')[1] +
                '/core/action/' +
                _action +
                '?ids=' +
                JSON.stringify(ids)
        )
        .send(payload)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

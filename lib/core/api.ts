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

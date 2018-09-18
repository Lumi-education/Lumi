import * as request from 'superagent';
import { assign } from 'lodash';
declare var window;

export function get_activites() {
    return request
        .get('/api/v0/activites')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}
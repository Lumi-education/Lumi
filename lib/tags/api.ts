import * as request from 'superagent';
import { assign } from 'lodash';
declare var window;

export function create_tag(name: string, tag?: any) {
    return request
        .post('/api/v0/tags')
        .send(assign(tag, { name }))
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function delete_tag(tag_id: string) {
    return request
        .delete('/api/v0/tags/' + tag_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_tags(doc_id?: string) {
    if (doc_id) {
        return request
            .get('/api/v0/tags?doc_id=' + doc_id)
            .set(
                'x-auth',
                window.localStorage.jwt_token || window.jwt_token || ''
            );
    }
    return request
        .get('/api/v0/tags')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_tag(tag_id: string, update: any) {
    return request
        .put('/api/v0/tags/' + tag_id)
        .send({
            tag_id,
            update
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

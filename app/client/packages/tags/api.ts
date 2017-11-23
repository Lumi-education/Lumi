import * as request from 'superagent';
declare var window;

export function create_tag(name: string, description?: string) {
    return request
        .post('/api/v0/tags')
        .send({ name, description })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function delete_tag(tag_id: string) {
    return request
        .delete('/api/v0/tags/' + tag_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_tags() {
    return request
        .get('/api/v0/tags')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function add_tag_to_doc(doc_id: string, tag_id: string) {
    return request
        .put('/api/v0/tags/' + tag_id + '/action')
        .send({
            type: 'ADD_TO_DOC',
            payload: { doc_id }
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function rem_tag_from_doc(doc_id: string, tag_id: string) {
    return request
        .put('/api/v0/tags/' + tag_id + '/action')
        .send({
            type: 'REM_FROM_DOC',
            payload: { doc_id }
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

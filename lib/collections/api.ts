import * as request from 'superagent';

declare var window;

export function get_collections(_ids?: string[]) {
    return request
        .get(
            '/api/v0/collections' +
                (_ids ? '?_ids=' + JSON.stringify(_ids) : '')
        )
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function add_cards_to_collection(
    collection_id: string,
    card_ids: string[]
) {
    return request
        .put('/api/v0/collections/' + collection_id + '/action')
        .send({
            type: 'ADD_CARDS',
            payload: { card_ids }
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function rem_cards_to_collection(
    collection_id: string,
    card_ids: string[]
) {
    return request
        .put('/api/v0/collections/' + collection_id + '/action')
        .send({
            type: 'REM_CARDS',
            payload: { card_ids }
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function post_collection() {
    return request
        .post('/api/v0/collections')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function delete_collection(collection_id: string) {
    return request
        .delete('/api/v0/collections/' + collection_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_user_collections() {
    return request
        .get('/api/v0/user/collections')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_collection(collection_id: string, update) {
    return request
        .put('/api/v0/collections/' + collection_id)
        .send(update)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function submit_collection(collection_id: string) {
    return request
        .put('/api/v0/data/submit_collection')
        .send({ collection_id })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function reset_collection(collection_meta_id: string) {
    return request
        .put('/api/user/collection/' + collection_meta_id + '/reset')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function assign_collection(user_ids: string[], data) {
    return request
        .post(
            '/api/v0/users/action/ASSIGN_COLLECTION?user_ids=' +
                JSON.stringify(user_ids)
        )
        .send(data)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

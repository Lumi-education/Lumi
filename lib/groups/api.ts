import * as request from 'superagent';
declare var window;

export function create_group(name: string) {
    return request
        .post('/api/v0/groups')
        .send({ name })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function delete_group(_id: string) {
    return request
        .delete('/api/v0/groups/' + _id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_groups() {
    return request
        .get('/api/v0/groups')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_group(group_id: string) {
    return request
        .get('/api/v0/groups/' + group_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_user_groups(user_id: string) {
    return request
        .get('/api/v0/groups/user/' + user_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function add_group(user_id: string, group_id: string) {
    return request
        .put('/api/v0/groups/' + group_id + '/action')
        .send({
            type: 'ADD_USER_TO_GROUP',
            payload: { group_id, user_id }
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function rem_group(user_id: string, group_id: string) {
    return request
        .put('/api/v0/groups/' + group_id + '/action')
        .send({
            type: 'REM_USER_FROM_GROUP',
            payload: { group_id, user_id }
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_group(group_id: string, update) {
    return request
        .put('/api/v0/groups/' + group_id)
        .send(update)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

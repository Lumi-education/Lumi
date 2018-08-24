import * as request from 'superagent';

declare var window;

export function assign(user_ids: string[], card_ids: string[]) {
    return request
        .post('/api/v0/flow/assign')
        .send({ user_ids, card_ids })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}
export function delete_assignments(assignment_ids: string[]) {
    return request
        .delete('/api/v0/flow/assignments')
        .send({ assignment_ids })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}
export function update_assignments(assignment_ids: string[], update: any) {
    return request
        .put('/api/v0/flow/assignments')
        .send({ assignment_ids, update })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}
export function archive_assignments(assignment_ids: string[]) {
    return request
        .post('/api/v0/flow/assignments/archive')
        .send({ assignment_ids })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

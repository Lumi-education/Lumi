import * as request from 'superagent';
declare var window;

export function get_user_grades(user_id: string) {
    return request
        .get('/api/v0/users/' + user_id + '/grades')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function create_grade(
    user_id: string,
    grade_type: string,
    score: number,
    note: string,
    ref_id: string
) {
    return request
        .post('/api/v0/users/' + user_id + '/grades')
        .send({
            user_id,
            grade_type,
            score,
            note,
            ref_id
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function delete_grade(grade_id: string) {
    return request
        .delete('/api/v0/grades/' + grade_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update_grade(grade_id: string, update) {
    return request
        .put('/api/v0/grades/' + grade_id)
        .send(update)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

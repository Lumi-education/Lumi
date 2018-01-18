import * as request from 'superagent';
declare var window;

export function get_user_grades(user_id: string) {
    return request
        .get(
            '/api/v0/' +
                window.location.pathname.split('/')[1] +
                '/users/' +
                user_id +
                '/grades'
        )
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
        .post(
            '/api/v0/' +
                window.location.pathname.split('/')[1] +
                '/users/' +
                user_id +
                '/grades'
        )
        .send({
            user_id,
            grade_type,
            score,
            note,
            ref_id
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

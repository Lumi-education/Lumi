import * as request from 'superagent';
declare var window;

export function create_competence(name: string, description?: string) {
    return request
        .post('/api/v0/competences')
        .send({ name, description })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function delete_competence(competence_id: string) {
    return request
        .delete('/api/v0/competences/' + competence_id)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_competences(doc_id?: string) {
    if (doc_id) {
        return request
            .get('/api/v0/competences?doc_id=' + doc_id)
            .set(
                'x-auth',
                window.localStorage.jwt_token || window.jwt_token || ''
            );
    }
    return request
        .get('/api/v0/competences')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function add_competence_to_doc(doc_id: string, competence_id: string) {
    return request
        .put('/api/v0/competences/' + competence_id + '/action')
        .send({
            type: 'ADD_TO_DOC',
            payload: { doc_id }
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function rem_competence_from_doc(doc_id: string, competence_id: string) {
    return request
        .put('/api/v0/competences/' + competence_id + '/action')
        .send({
            type: 'REM_FROM_DOC',
            payload: { doc_id }
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

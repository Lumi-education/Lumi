import * as request from 'superagent';
declare var window;

export function checkDb(db: string) {
    return request
        .get('/api/v0/' + db)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

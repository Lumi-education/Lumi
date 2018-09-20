import * as request from 'superagent';

import { Comment } from './models';

declare var window;

export function create_comment(
    from: string,
    to: string,
    ref_id: string,
    text: string,
    from_name
) {
    return request
        .post('/api/v0/comments')
        .send(
            new Comment({
                from,
                to,
                ref_id,
                text,
                from_name,
                user_id: to,
                seen_by: [from],
                date: new Date().toString(),
                _id: undefined,
                type: 'comment'
            })
        )
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function comment_seen(comment_ids, user_id) {
    return request
        .put('/api/v0/comments/seen')
        .send({
            comment_ids,
            user_id
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

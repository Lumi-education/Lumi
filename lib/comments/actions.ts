export const COMMENTS_CREATE_COMMENT_REQUEST =
    'COMMENTS_CREATE_COMMENT_REQUEST';
export const COMMENTS_CREATE_COMMENT_SUCCESS =
    'COMMENTS_CREATE_COMMENT_SUCCESS';
export const COMMENTS_CREATE_COMMENT_ERROR = 'COMMENTS_CREATE_COMMENT_ERROR';

export const COMMENTS_GET_COMMENTS_REQUEST = 'COMMENTS_GET_COMMENTS_REQUEST';
export const COMMENTS_GET_COMMENTS_SUCCESS = 'COMMENTS_GET_COMMENTS_SUCCESS';
export const COMMENTS_GET_COMMENTS_ERROR = 'COMMENTS_GET_COMMENTS_ERROR';

export const COMMENTS_COMMENT_SEEN_REQUEST = 'COMMENTS_COMMENT_SEEN_REQUEST';
export const COMMENTS_COMMENT_SEEN_SUCCESS = 'COMMENTS_COMMENT_SEEN_SUCCESS';
export const COMMENTS_COMMENT_SEEN_ERROR = 'COMMENTS_COMMENT_SEEN_ERROR';

import * as API from './api';

export function create_comment(
    from: string,
    to: string,
    text: string,
    ref_id: string,
    from_name: string
) {
    return {
        types: [
            COMMENTS_CREATE_COMMENT_REQUEST,
            COMMENTS_CREATE_COMMENT_SUCCESS,
            COMMENTS_CREATE_COMMENT_ERROR
        ],
        api: API.create_comment(from, to, ref_id, text, from_name),
        payload: { payload: { from, to, ref_id, text, from_name } }
    };
}

export function get_comments() {
    return {
        types: [
            COMMENTS_GET_COMMENTS_REQUEST,
            COMMENTS_GET_COMMENTS_SUCCESS,
            COMMENTS_GET_COMMENTS_ERROR
        ],
        api: API.get_comments(),
        payload: {}
    };
}

export function comments_seen(comment_ids: string[], user_id: string) {
    return {
        types: [
            COMMENTS_COMMENT_SEEN_REQUEST,
            COMMENTS_COMMENT_SEEN_SUCCESS,
            COMMENTS_COMMENT_SEEN_ERROR
        ],
        api: API.comment_seen(comment_ids, user_id),
        payload: { payload: { comment_ids, user_id } }
    };
}

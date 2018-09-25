import raven from 'lib/core/raven';

import { IState } from './types';

import { Comment } from './models';

export function ref_id(state: IState, _ref_id: string): Comment[] {
    try {
        return state.comments.list
            .filter(c => c.ref_id === _ref_id)
            .map(c => new Comment(c))
            .sort((a, b) => a.get_date().unix() - b.get_date().unix());
    } catch (error) {
        raven.captureException(error);
        return [];
    }
}

export function unread(state: IState, _ref_id: string, user_id): Comment[] {
    try {
        if (_ref_id === '*') {
            return state.comments.list
                .filter(c => c.seen_by.indexOf(user_id) === -1)
                .map(c => new Comment(c))
                .sort((a, b) => a.get_date().unix() - b.get_date().unix());
        }
        return state.comments.list
            .filter(
                c => c.ref_id === _ref_id && c.seen_by.indexOf(user_id) === -1
            )
            .map(c => new Comment(c))
            .sort((a, b) => a.get_date().unix() - b.get_date().unix());
    } catch (error) {
        raven.captureException(error);
        return [];
    }
}

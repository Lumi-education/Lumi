import { unionBy } from 'lodash';
import raven from 'lib/core/raven';

// modules

// local

import * as Actions from '../actions';
import { Comment } from '../models';

// types
import { IComment } from '../types';

export default function(state: IComment[] = [], action): IComment[] {
    try {
        switch (action.type) {
            case Actions.COMMENTS_COMMENT_SEEN_SUCCESS:
            case 'DB_CHANGE':
                return unionBy(
                    action.payload.filter(d => d.type === 'comment'),
                    state,
                    '_id'
                );

            case Actions.COMMENTS_CREATE_COMMENT_SUCCESS:
                return [...state, action.payload].filter(
                    comment => comment._id
                );

            case Actions.COMMENTS_CREATE_COMMENT_REQUEST:
                return [...state, new Comment(action.payload)];

            default:
                return state;
        }
    } catch (error) {
        raven.captureException(error);
        return state;
    }
}

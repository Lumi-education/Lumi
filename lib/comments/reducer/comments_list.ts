import { assign, unionBy } from 'lodash';

import raven from 'lib/core/raven';

import { IComment } from '../types';

import * as Actions from '../actions';
import { Comment } from '../models';

import * as Users from 'lib/users';

import { USERS_INIT_USER_SUCCESS } from 'lib/users/actions';

export default function(state: IComment[] = [], action): IComment[] {
    try {
        switch (action.type) {
            case Users.actions.USERS_GET_USERS_SUCCESS:
            case Users.actions.USERS_GET_USER_SUCCESS:
            case USERS_INIT_USER_SUCCESS:
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

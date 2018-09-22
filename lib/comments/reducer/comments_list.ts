import { assign, unionBy } from 'lodash';

import { IComment } from '../types';

import * as Actions from '../actions';

import * as Users from 'lib/users';

export default function(state: IComment[] = [], action): IComment[] {
    switch (action.type) {
        case Users.actions.USERS_GET_USERS_SUCCESS:
        case Users.actions.USERS_GET_USER_SUCCESS:
        case Actions.COMMENTS_COMMENT_SEEN_SUCCESS:
        case 'DB_CHANGE':
            return unionBy(
                action.payload.filter(d => d.type === 'comment'),
                state,
                '_id'
            );

        case Actions.COMMENTS_CREATE_COMMENT_SUCCESS:
            return [...state, action.payload].filter(comment => comment._id);

        case Actions.COMMENTS_CREATE_COMMENT_REQUEST:
            return [...state, action.payload];

        default:
            return state;
    }
}

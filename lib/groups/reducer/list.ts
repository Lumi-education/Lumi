import { IGroup } from '../types';
import { assign, unionBy } from 'lodash';

import {
    GROUPS_GET_GROUPS_SUCCESS,
    GROUPS_GET_GROUP_SUCCESS,
    GROUPS_CREATE_SUCCESS,
    GROUPS_DELETE_SUCCESS,
    GROUPS_ADD_COLLECTION_SUCCESS,
    GROUPS_REM_COLLECTION_SUCCESS,
    GROUPS_ASSIGN_GROUPS_SUCCESS,
    GROUPS_ADD_CARDS_REQUEST,
    GROUPS_CREATE_REQUEST
} from '../actions';

import { USERS_GET_USER_SUCCESS } from '../../users/actions';

export default function(state: IGroup[] = [], action): IGroup[] {
    switch (action.type) {
        // case GROUPS_CREATE_REQUEST:
        //     return [...state, action.payload];

        case GROUPS_DELETE_SUCCESS:
            return state.filter(group => group._id !== action.group_id);

        case GROUPS_ADD_CARDS_REQUEST:
            return state.map(group =>
                group._id === action.group_id
                    ? assign({}, group, {
                          cards: [...group.cards, ...action.card_ids]
                      })
                    : group
            );

        case GROUPS_CREATE_SUCCESS:
        case GROUPS_ADD_COLLECTION_SUCCESS:
        case GROUPS_REM_COLLECTION_SUCCESS:
            return [...state, action.payload];

        case 'DB_CHANGE':
        case 'CORE_UPDATE_DB_SUCCESS':
        case 'CORE_CREATE_DB_SUCCESS':
        case USERS_GET_USER_SUCCESS:
        case GROUPS_ASSIGN_GROUPS_SUCCESS:
        case GROUPS_GET_GROUPS_SUCCESS:
        case GROUPS_GET_GROUP_SUCCESS:
            return unionBy(
                action.payload.filter(d => d.type === 'group'),
                state,
                '_id'
            );

        default:
            return state;
    }
}

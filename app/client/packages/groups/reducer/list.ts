import { assign, unionBy } from 'lodash';

import { Map } from 'immutable';

import { IGroup } from 'common/types';

import { arrayToObject } from 'client/utils';

import {
    GROUPS_GET_GROUPS_SUCCESS,
    GROUPS_GET_GROUP_SUCCESS,
    GROUPS_CREATE_SUCCESS,
    GROUPS_DELETE_SUCCESS,
    GROUPS_ADD_COLLECTION_SUCCESS,
    GROUPS_REM_COLLECTION_SUCCESS,
    DB_CHANGE
} from 'client/packages/action-types';

import {
    USERS_GET_USERS_SUCCESS,
    USERS_GET_USER_SUCCESS
} from 'client/packages/users/constants';

export default function(
    state: Map<string, IGroup> = Map<string, IGroup>({}),
    action
): Map<string, IGroup> {
    switch (action.type) {
        case GROUPS_DELETE_SUCCESS:
            return state.delete(action.group_id);

        case GROUPS_CREATE_SUCCESS:
        case GROUPS_ADD_COLLECTION_SUCCESS:
        case GROUPS_REM_COLLECTION_SUCCESS:
            const o = {};
            o[action.payload._id] = action.payload;
            return state.merge(Map<string, IGroup>(o));

        case DB_CHANGE:
        case USERS_GET_USERS_SUCCESS:
        case USERS_GET_USER_SUCCESS:
        case GROUPS_GET_GROUPS_SUCCESS:
        case GROUPS_GET_GROUP_SUCCESS:
            return state.merge(
                Map<string, IGroup>(
                    arrayToObject(
                        action.payload.filter(d => d.type === 'group')
                    )
                )
            );

        default:
            return state;
    }
}

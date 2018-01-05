import { assign, unionBy } from 'lodash';

import { Map } from 'immutable';

import { IGroupRef } from '../types';

import { arrayToObject } from 'lib/core/utils';

import {
    GROUPS_ADD_GROUP_REQUEST,
    GROUPS_REM_GROUP_REQUEST,
    GROUPS_GET_GROUP_SUCCESS,
    GROUPS_GET_USER_GROUPS_SUCCESS
} from '../constants';

const defaultGroupRef = {};

export default function(
    state: Map<string, IGroupRef> = Map<string, IGroupRef>({}),
    action
): Map<string, IGroupRef> {
    switch (action.type) {
        case GROUPS_ADD_GROUP_REQUEST:
            if (state.get(action.payload.user_id + '-groups')) {
                return state.update(
                    action.payload.user_id + '-groups',
                    group_ref => {
                        group_ref.groups.push(action.payload.group_id);
                        return group_ref;
                    }
                );
            }
            return state.set(action.payload.user_id + '-groups', {
                user_id: action.payload.user_id,
                groups: [action.payload.group_id],
                type: 'group_ref'
            });

        case GROUPS_REM_GROUP_REQUEST:
            return state.set(action.payload.user_id + '-groups', {
                user_id: action.payload.user_id,
                groups: state
                    .get(action.payload.user_id + '-groups')
                    .groups.filter(g_id => g_id !== action.payload.group_id),
                type: 'group_ref'
            });

        case 'DB_CHANGE':
        case GROUPS_GET_GROUP_SUCCESS:
        case GROUPS_GET_USER_GROUPS_SUCCESS:
            return state.merge(
                Map<string, IGroupRef>(
                    arrayToObject(
                        action.payload.filter(d => d.type === 'group_ref')
                    )
                )
            );

        default:
            return state;
    }
}

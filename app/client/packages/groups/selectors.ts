import { Map } from 'immutable';
import { IState } from 'client/state';

import { IGroup, IGroupRef } from './types';

export function groups_list(state: IState): IGroup[] {
    return state.groups.map.toArray();
}

export function select_group(state: IState, group_id: string): IGroup {
    return state.groups.map.get(group_id, {
        _id: undefined,
        name: 'group ' + group_id + ' not found',
        type: 'group',
        assigned_collections: [],
        active_collections: [],
        created_at: new Date()
    });
}

export function select_groups_for_user(
    state: IState,
    user_id: string
): IGroup[] {
    return select_groupref_for_user(state, user_id).groups.map(group_id =>
        select_group(state, group_id)
    );
}

export function select_groupref_for_user(
    state: IState,
    user_id: string
): IGroupRef {
    return state.groups.refs.get(user_id + '-groups', {
        user_id,
        _id: undefined,
        groups: [],
        type: 'group_ref'
    });
}

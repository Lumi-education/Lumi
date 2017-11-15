import { Map } from 'immutable';
import { IState } from '../';

import { IGroup } from 'lib/types';

export function groups_list(state: IState): IGroup[] {
    return state.groups.list.toArray();
}

export function select_group(state: IState, group_id: string): IGroup {
    return state.groups.list.get(group_id, {
        _id: undefined,
        name: 'group ' + group_id + ' not found',
        type: 'group',
        assigned_collections: [],
        created_at: new Date()
    });
}

import {Map} from 'immutable';
import {IState, IGroup} from './types';
import {flatten} from 'lodash';

export function groups_list(state: IState): IGroup[] {
    return state.groups.map.toArray();
}

export function select_group(state: IState, group_id: string): IGroup {
    return state.groups.map.get(group_id, {
        _id: undefined,
        name: 'group ' + group_id + ' not found',
        type: 'group',
        flow_order: [],
        created_at: new Date()
    });
}

export function selected_groups(state: IState): IGroup[] {
    return state.groups.ui.selected_groups.map(id => select_group(state, id));
}

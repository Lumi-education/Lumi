import { IState, IGroup } from './types';

export function groups_list(state: IState): IGroup[] {
    return state.groups.list;
}

export function select_group(state: IState, group_id: string): IGroup {
    return (
        state.groups.list.filter(group => group._id === group_id)[0] || {
            _id: undefined,
            name: 'group ' + group_id + ' not found',
            type: 'group',
            created_at: new Date(),
            autojoin: false,
            cards: []
        }
    );
}

export function selected_groups(state: IState): IGroup[] {
    return state.groups.ui.selected_groups.map(id => select_group(state, id));
}

export function selected_group_ids(state: IState): string[] {
    return state.groups.ui.selected_groups;
}

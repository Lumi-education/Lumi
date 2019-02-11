import { IState } from './types';
import * as Core from 'lib/core';
import { Group } from './models';

export function groups_list(state: IState): Group[] {
    try {
        return state.groups.list.map(_group => new Group(_group));
    } catch (error) {
        Core.raven.captureException(error);
        return [];
    }
}

export function group(state: IState, group_id: string): Group {
    try {
        return new Group(state.groups.list.filter(g => g._id === group_id)[0]);
    } catch (error) {
        Core.raven.captureException(error);
        return new Group();
    }
}

export function selected_groups(state: IState): Group[] {
    try {
        return state.groups.ui.selected_groups.map(id => group(state, id));
    } catch (error) {
        Core.raven.captureException(error);
        return [];
    }
}

export function selected_group_ids(state: IState): string[] {
    try {
        return state.groups.ui.selected_groups;
    } catch (error) {
        Core.raven.captureException(error);
        return [];
    }
}

export function dialog(state: IState, key: string): boolean {
    try {
        return state.groups.ui.dialogs[key] || false;
    } catch (error) {
        Core.raven.captureException(error);
        return false;
    }
}

export function ui_group(state: IState): Group {
    return new Group(state.groups.ui.group);
}

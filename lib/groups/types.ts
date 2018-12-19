type Group_id = string;

import { IDoc } from 'lib/core/types';

export interface IGroup extends IDoc {
    _id: Group_id;
    type: 'group';
    name: string;
    created_at: Date;
    autojoin: boolean;
    cards: string[];
}

export interface IGroupUI {
    selected_groups: string[];
    group: IGroup;
    error: {
        message: string;
    };
    show_create_group_dialog: boolean;
}

export interface IState {
    groups: {
        list: IGroup[];
        ui: IGroupUI;
    };
}

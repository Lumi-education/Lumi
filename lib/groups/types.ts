import {Map} from 'immutable';
type Group_id = string;

export interface IGroup {
    _id: Group_id;
    type: 'group';
    name: string;
    flow_order: string[];
    created_at: Date;
}

export interface IGroupUI {
    selected_groups: string[];
}

export interface IState {
    groups: {
        map: Map<string, IGroup>;
        ui: IGroupUI;
    };
}

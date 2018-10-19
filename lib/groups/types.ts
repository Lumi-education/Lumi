type Group_id = string;

export interface IGroup {
    _id: Group_id;
    type: 'group';
    name: string;
    created_at: Date;
    members: string[]; // no longer needed -> deprecate issue #234
}

export interface IGroupUI {
    selected_groups: string[];
}

export interface IState {
    groups: {
        list: IGroup[];
        ui: IGroupUI;
    };
}

type Group_id = string;

export interface IGroup {
    _id: Group_id;
    type: 'group';
    name: string;
    created_at: Date;
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

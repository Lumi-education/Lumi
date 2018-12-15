type Group_id = string;

export interface IGroup {
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

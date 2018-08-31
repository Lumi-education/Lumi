type Group_id = string;

export interface IGroup {
    _id: Group_id;
    type: 'group';
    name: string;
    created_at: Date;
    members: string[]; // members field is used to maintain a constant order in admin -> groups -> group-flow-tab; without members the order of users changes due to array.map()
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

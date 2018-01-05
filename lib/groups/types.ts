import { Map } from 'immutable';
type Group_id = string;

export interface IGroup {
    _id: Group_id;
    type: 'group';
    name: string;
    assigned_collections: string[];
    active_collections: string[];
    created_at: Date;
}

export interface IGroupRef {
    _id?: string;
    user_id: string;
    groups: Group_id[];
    type: 'group_ref';
    created_at?: Date;
    updated_at?: Date;
}

export interface IState {
    groups: {
        map: Map<string, IGroup>;
        refs: Map<string, IGroupRef>;
    };
}

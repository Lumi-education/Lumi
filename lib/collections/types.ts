export type Collection_id = string;

export interface ICollection {
    _id: Collection_id;
    type: 'collection';
    name: string;
    description: string;
    cards: string[];
    created_at: Date;
    updated_at: Date;
    submit_messages: ICollectionSubmitMsg[];
}

export interface IBaseData {
    _id: string;
    type: 'data';
    user_id: string;
    created_at: Date;
    updated_at: Date;
}

export interface ICollectionData extends IBaseData {
    data_type: 'collection';
    collection_id: string;
    user_id: string;
    submitted: boolean;
    submit_date: Date;
    is_graded: boolean;
    score: number;
    due_date: Date;
    auto_complete: boolean;
    completed: boolean;
}

export interface ICollectionSubmitMsg {
    score: number;
    msg: string;
}

export interface ICollectionUI {
    selected_collections: Collection_id[];
    selected_collection_data: string[];
    show_assign_collection_dialog: boolean;
}

export interface IState {
    collections: {
        list: ICollection[];
        data: ICollectionData[];
        ui: ICollectionUI;
    };
}

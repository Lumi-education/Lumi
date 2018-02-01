export type Collection_id = string;

import { ICollectionData } from 'lib/cards';

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

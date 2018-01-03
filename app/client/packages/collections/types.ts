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

export interface ICollectionSubmitMsg {
    score: number;
    msg: string;
}

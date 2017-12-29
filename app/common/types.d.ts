type Card_id = string;
type Collection_id = string;
type Data_id = string;
type User_id = string;
type Group_id = string;
type Markdown = string;
type Session_id = string;
type Card_types = 'multiplechoice' | 'freetext' | 'text' | 'sort' | 'video';

export interface ICollection {
    _id: Collection_id;
    type: 'collection';
    name: string;
    description: string;
    cards: Array<Card_id>;
    created_at: Date;
    updated_at: Date;
    submit_messages: ICollectionSubmitMsg[];
}

export interface ICollectionSubmitMsg {
    score: number;
    msg: Markdown;
}

// export interface ICard {
//     _id: Card_id;
//     type: 'card';
//     card_type: Card_types;
//     name: string;
//     text: Markdown;
//     items: Array<Markdown>;
//     hints: Array<Markdown>;
//     description: string;
//     url: string;
//     created_at: Date;
//     _attachments;
// }

// export interface IData {
//     _id: Data_id;
//     data_type: string;
//     collection_id: Collection_id;
//     user_id: User_id;
//     score: number;
// }

export interface IGroup {
    _id: Group_id;
    type: 'group';
    name: string;
    assigned_collections: Array<Collection_id>;
    active_collections: Array<Collection_id>;
    created_at: Date;
}

export interface ISession {
    _id: Session_id;
    type: 'session';
    user_id: User_id;
    online: boolean;
}

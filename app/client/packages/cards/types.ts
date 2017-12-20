type Card_id = string;
type Data_id = string;
export type Card_types =
    | 'multiplechoice'
    | 'freetext'
    | 'text'
    | 'sort'
    | 'video';
type Markdown = string;

export type ICard = IFreetextCard | IMultiplechoiceCard | IVideoCard;
export type IData = IFreetextCardData | IMultiplechoiceCardData;

export interface IBaseCard {
    _id: Card_id;
    type: 'card';
    card_type: Card_types;
    name: string;
    text: Markdown;
    description: string;
    created_at: Date;
    _attachments;
}

export interface IBaseData {
    _id: Data_id;
    type: 'data';
    data_type: 'card';
    card_type: Card_types;
    card_id: string;
    user_id: string;
    collection_id: string;
    created_at: Date;
    updated_at: Date;
    score: number;
}

export interface IVideoCard extends IBaseCard {
    video_url: string;
    youtube: boolean;
    card_type: 'video';
}

export interface IFreetextCard extends IBaseCard {
    card_type: 'freetext';
    answer: string;
}

export interface IFreetextCardData extends IBaseData {
    data_type: 'card';
    card_type: 'freetext';
    answer: string;
}

export interface IMultiplechoiceCard extends IBaseCard {
    items: Markdown[];
    card_type: 'multiplechoice';
}

export interface IMultiplechoiceCardData extends IBaseData {
    items: Markdown[];
    card_type: 'multiplechoice';
}

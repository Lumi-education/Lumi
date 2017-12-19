type Card_id = string;
type Data_id = string;
type Card_types = 'multiplechoice' | 'freetext' | 'text' | 'sort' | 'video';
type Markdown = string;

export type ICard = IFreetextCard | IMultiplechoiceCard;
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
    data_type: 'card' | 'freetext';
    card_id: string;
    user_id: string;
    collection_id: string;
    score: number;
    created_at: Date;
    updated_at: Date;
}

export interface IFreetextCard extends IBaseCard {
    card_type: 'freetext';
    answer: string;
}

export interface IFreetextCardData extends IBaseData {
    data_type: 'freetext';
    answer: string;
}

export interface IMultiplechoiceCard extends IBaseCard {
    items: Markdown[];
}

export interface IMultiplechoiceCardData extends IBaseData {
    items: Markdown[];
}

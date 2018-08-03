import { Map } from 'immutable';

type Card_id = string;
type Data_id = string;
export type Card_types =
    | 'multiplechoice'
    | 'freetext'
    | 'text'
    | 'sort'
    | 'upload'
    | 'video'
    | 'h5p';
type Markdown = string;

export type ICard =
    | IFreetextCard
    | IMultiplechoiceCard
    | IVideoCard
    | IUploadCard
    | ITextCard
    | IH5PCard;

export type IData =
    | IFreetextCardData
    | IMultiplechoiceCardData
    | IVideoCardData
    | IUploadCardData
    | ITextCardData;

export interface IBaseCard {
    _id: Card_id;
    type: 'card';
    name: string;
    card_type: string;
    text: Markdown;
    description: string;
    created_at: Date;
    _attachments;
    _rev: string;
}

export interface IBaseData {
    _id: Data_id;
    type: 'data';
    user_id: string;
    created_at: Date;
    updated_at: Date;
}

export interface ICardData extends IBaseData {
    card_id: string;
    assignment_id: string;
    data_type: 'card';
    group_id?: string;
    card_type: string;
    score: number;
    is_graded: boolean;
    graded: boolean;
    show_answer: boolean;
    processed: boolean;
}

export interface ITextCard extends IBaseCard {
    card_type: 'text';
}

export interface IH5PCard extends IBaseCard {
    content_id: string;
    card_type: 'h5p';
}

export interface ITextCardData extends ICardData {
    card_type: 'text';
}

export interface IUploadCard extends IBaseCard {
    card_type: 'upload';
}

export interface IUploadCardData extends ICardData {
    data_type: 'card';
    card_type: 'upload';
    _attachments;
}

export interface IVideoCard extends IBaseCard {
    video_url: string;
    youtube: boolean;
    card_type: 'video';
}

export interface IVideoCardData extends ICardData {
    card_type: 'video';
}

export interface IFreetextCard extends IBaseCard {
    card_type: 'freetext';
    auto_grade: boolean;
    answer: string;
    preview: boolean;
}

export interface IFreetextCardData extends ICardData {
    data_type: 'card';
    card_type: 'freetext';
    auto_grade: boolean;
    answer: string;
}

export interface IMultiplechoiceCard extends IBaseCard {
    items: Markdown[];
    card_type: 'multiplechoice';
}

export interface IMultiplechoiceCardData extends ICardData {
    items: Markdown[];
    card_type: 'multiplechoice';
}

export interface ICardUI {
    selected_cards: string[];
}

export interface IState {
    cards: {
        map: Map<string, ICard>;
        ui: ICardUI;
        data: Map<string, IData>;
    };
}

import { IH5P, IContent } from 'h5p-nodejs-library';

export type Card_id = string;
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

export interface IBaseCard {
    _id: Card_id;
    type: 'card';
    name: string;
    card_type: Card_types;
    text: Markdown;
    tags: string[];
    description: string;
    created_at: Date;
    _rev: string;
    files: string[];
}

export interface ITextCard extends IBaseCard {
    card_type: 'text';
}

export interface IH5PCard extends IBaseCard {
    h5p: IH5P;
    content: IContent;
    content_id: string;
    card_type: 'h5p';
}

export interface IUploadCard extends IBaseCard {
    card_type: 'upload';
}

export interface IVideoCard extends IBaseCard {
    video_url: string;
    youtube: boolean;
    card_type: 'video';
}

export interface IFreetextCard extends IBaseCard {
    card_type: 'freetext';
    auto_grade: boolean;
    answer: string;
    preview: boolean;
}

export interface IMultiplechoiceCard extends IBaseCard {
    items: Markdown[];
    card_type: 'multiplechoice';
}

export interface ICardUI {
    selected_cards: string[];
    card: any;
}

export interface IUICardSearchMenu {
    subject: Subjects;
}

export type Subjects = 'physics' | 'chemistry' | 'maths';

export interface IState {
    cards: {
        list: ICard[];
        ui: ICardUI;
        card_search_menu: IUICardSearchMenu;
    };
}

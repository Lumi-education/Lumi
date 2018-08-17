import { Map } from 'immutable';
type Tag_id = string;

export interface ITag {
    _id: Tag_id;
    type: 'tag';
    name: string;
    short_name: string;
    description: string;
    color: string;
    created_at: Date;
}

export interface ITagsUI {
    selected_tags: string[];
    show_dialog: boolean;
    tag: ITag;
}

export interface IState {
    tags: {
        map: Map<string, ITag>;
        ui: ITagsUI;
    };
}

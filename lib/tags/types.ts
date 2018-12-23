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
    selected_tags: string[]; // deprecate with universal selection module #286
    tag: ITag;
}

export interface IState {
    tags: {
        list: ITag[];
        ui: ITagsUI;
    };
}

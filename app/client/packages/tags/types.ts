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

export interface ITagRef {
    _id?: string;
    doc_id: string;
    tag_id: Tag_id;
    type: 'tag_ref';
    created_at?: Date;
    updated_at?: Date;
}

export interface IState {
    tags: {
        map: Map<string, ITag>;
        refs: Map<string, ITagRef>;
    };
}

import { Map } from 'immutable';

import { ITag, IState } from './types';

export function select_all_tags(state: IState): ITag[] {
    return state.tags.map.toArray();
}

export function select_tags_as_map(state: IState): Map<string, ITag> {
    return state.tags.map;
}

export function select_tag_ids_for_doc(
    state: IState,
    doc_id: string
): string[] {
    return state.tags.refs
        .toArray()
        .filter(ref => ref.doc_id === doc_id)
        .map(ref => ref.tag_id);
}

export function select_tag(state: IState, tag_id): ITag {
    return state.tags.map.get(tag_id, {
        _id: undefined,
        type: 'tag',
        name: 'tag not found',
        short_name: '404',
        description: 'tag not found',
        color: 'red',
        created_at: new Date()
    });
}

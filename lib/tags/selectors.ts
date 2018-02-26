import { Map } from 'immutable';

import { isEqual, intersection } from 'lodash';
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
    return state.tags.refs.get(doc_id + '-tags', {
        doc_id,
        tags: [],
        type: 'tag_ref'
    }).tags;
}

export function select_doc_ids_for_tags(
    state: IState,
    tag_ids: string[]
): string[] {
    return state.tags.refs
        .toArray()
        .filter(ref =>
            isEqual(intersection(ref.tags, tag_ids).sort(), tag_ids.sort())
        )
        .map(ref => ref.doc_id);
}

export function select_tags_by_doc_id(state: IState, doc_id: string): ITag[] {
    const tags_ids = select_tag_ids_for_doc(state, doc_id);

    return tags_ids.map(tag_id => select_tag(state, tag_id));
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

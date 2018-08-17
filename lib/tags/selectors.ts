import { Map } from 'immutable';

import { isEqual, intersection } from 'lodash';
import { ITag, IState } from './types';

export function select_all_tags(state: IState): ITag[] {
    return state.tags.map.toArray();
}

export function select_tags_as_map(state: IState): Map<string, ITag> {
    return state.tags.map;
}

export function tag(state: IState, tag_id: string): ITag {
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

export function tags(state: IState, tag_ids: string[]): ITag[] {
    return tag_ids.map(tag_id => tag(state, tag_id));
}

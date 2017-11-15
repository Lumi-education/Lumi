import { Map } from 'immutable';
import { IState } from '../';

import { ITag } from 'common/types';

export function select_all_tags(state: IState): ITag[] {
    return state.tags.list.toArray();
}

export function select_tags_as_map(state: IState): Map<string, ITag> {
    return state.tags.list;
}

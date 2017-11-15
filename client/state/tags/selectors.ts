import { Map } from 'immutable';
import { IState } from '../';

import { ITag } from 'lib/types';

export function select_all_tags(state: IState): Array<ITag> {
    return state.tags.list.toArray();
}

export function select_tags_as_map(state: IState): Map<string, ITag> {
    return state.tags.list;
}

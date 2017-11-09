import { IState } from '../';

import { ICollection } from 'lib/types';

export function select_collections_by_ids(
    state: IState,
    collections_ids: Array<string>
): Array<ICollection> {
    return state.collections.list.filter(
        collection => collections_ids.indexOf(collection._id) > -1
    );
}

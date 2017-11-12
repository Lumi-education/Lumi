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

export function select_collection_by_id(
    state: IState,
    collection_id: string
): ICollection {
    return (
        state.collections.list.filter(
            collection => collection._id === collection_id
        )[0] || {
            _id: undefined,
            type: 'collection',
            name: 'collection not found',
            description: '',
            cards: [],
            tags: [],
            created_at: new Date()
        }
    );
}

export function select_collections_as_array(state: IState): Array<ICollection> {
    return state.collections.list;
}

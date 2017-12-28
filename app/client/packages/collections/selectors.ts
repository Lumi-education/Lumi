import { assign } from 'lodash';

import { IState } from 'client/state';

import { ICollection } from 'common/types';
import { ICollectionData } from 'client/packages/cards/types';

export interface IUserCollection extends ICollectionData {
    name: string;
    description: string;
    cards: ICollection['cards'];
}

export function select_collections_by_ids(
    state: IState,
    collections_ids: string[]
): ICollection[] {
    return state.collections.list.filter(
        collection => collections_ids.indexOf(collection._id) > -1
    );
}

export function select_collections_for_user(state: IState): IUserCollection[] {
    return state.collections.data.map(collection_data =>
        assign(
            {},
            collection_data,
            state.collections.list.filter(
                c => c._id === collection_data.collection_id
            )[0]
        )
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
            created_at: new Date(),
            updated_at: new Date()
        }
    );
}

export function select_collections_as_array(state: IState): ICollection[] {
    return state.collections.list;
}

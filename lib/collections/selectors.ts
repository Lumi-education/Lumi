import { assign, filter } from 'lodash';

import { IState } from './types';

import { ICollection } from 'lib/collections/types';
import { ICollectionData } from 'lib/cards/types';

export interface IUserCollection extends ICollectionData {
    name: string;
    description: string;
    cards: ICollection['cards'];
}

export function select_collections_by_ids(
    state: IState,
    collections_ids: string[]
): ICollection[] {
    if (!collections_ids) {
        return [];
    }
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

export function select_collection_for_user(
    state: IState,
    collection_id: string
): IUserCollection {
    return select_collections_for_user(state).filter(
        c => c._id === collection_id
    )[0];
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
            updated_at: new Date(),
            submit_messages: []
        }
    );
}

export function select_collections_as_array(state: IState): ICollection[] {
    return state.collections.list;
}

export function data(state: IState, user_id: string) {
    return state.collections.data.filter(c => c.user_id === user_id);
}

export function data_by_id(state: IState, id: string): ICollectionData {
    return state.collections.data.filter(c => c._id === id)[0];
}

export function data_query(state: IState, query): ICollectionData[] {
    return filter(state.collections.data, query);
}

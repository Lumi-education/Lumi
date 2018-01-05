import { Map } from 'immutable';
import { IState } from 'client/state';

import { IData, ICollectionData } from 'lib/cards/types';

export function select_data(
    state: IState,
    collection_id: string,
    card_id: string
): IData {
    return state.data.map
        .toArray()
        .filter(
            data =>
                (data as any).collection_id === collection_id &&
                (data as any).card_id === card_id &&
                (data as any).data_type === 'card'
        )[0];
}

export function select_data_for_user_and_collection(
    state: IState,
    user_id: string,
    collection_id: string
) {
    return state.data.map
        .toArray()
        .filter(
            d => d.user_id === user_id && d.collection_id === collection_id
        );
}

export function select_data_as_map(state: IState) {
    return state.data.map;
}

export function select_collection(
    state: IState,
    collection_id: string
): ICollectionData {
    return (
        (state.data.map as any)
            .toArray()
            .filter(
                data =>
                    (data as any).collection_id === collection_id &&
                    (data as any).data_type === 'collection'
            )[0] || {}
    );
}

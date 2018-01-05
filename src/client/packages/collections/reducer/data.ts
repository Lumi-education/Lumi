import { assign, unionBy } from 'lodash';

import {
    COLLECTION_GET_SUCCESS,
    COLLECTION_ADD_CARDS_REQUEST,
    COLLECTION_DELETE_COLLECTION_REQUEST,
    DB_CHANGE
} from '../../action-types';

import { ICollectionData } from 'client/packages/cards/types';

const initialState: ICollectionData[] = [];

export default function(
    state: ICollectionData[] = initialState,
    action
): ICollectionData[] {
    switch (action.type) {
        case DB_CHANGE:
        case COLLECTION_GET_SUCCESS:
            return unionBy(
                action.payload.filter(d => d.data_type === 'collection'),
                state,
                '_id'
            );

        default:
            return state;
    }
}

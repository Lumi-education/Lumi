import { ICard } from '../types';
import { unionBy, assign } from 'lodash';

import {
    CARDS_GET_CARDS_SUCCESS,
    CARDS_REM_TAG_SUCCESS,
    CARDS_ADD_TAG_SUCCESS,
    CARDS_UPDATE_CARD_SUCCESS,
    CARDS_DELETE_CARD_SUCCESS,
    CARDS_CREATE_CARD_SUCCESS
} from '../actions';

import * as Tags from 'lib/tags';

import { FLOW_GET_ASSIGNMENTS_SUCCESS } from 'lib/flow/actions';

import * as Users from 'lib/users';
import * as Core from 'lib/core';

export default function(state: ICard[] = [], action): ICard[] {
    switch (action.type) {
        case CARDS_REM_TAG_SUCCESS:
        case CARDS_ADD_TAG_SUCCESS:
        case CARDS_UPDATE_CARD_SUCCESS:
        case CARDS_CREATE_CARD_SUCCESS:
            return unionBy([action.payload], state, '_id');

        case CARDS_DELETE_CARD_SUCCESS:
            return state.filter(card => card._id !== action.card_id);

        case 'DB_CHANGE':
        case Core.actions.CORE_CREATE_DB_SUCCESS:

        case FLOW_GET_ASSIGNMENTS_SUCCESS:
            return unionBy(
                action.payload
                    .filter(d => d.type === 'card')
                    .map(card => {
                        const card_to_index = assign({}, card, {
                            _index: undefined,
                            _id: undefined,
                            _rev: undefined,
                            type: undefined
                        }); // remove old _index
                        const _index = JSON.stringify(card_to_index)
                            .replace(/[^A-Za-z0-9!?]/g, '')
                            .toLowerCase();
                        return assign({}, card, { _index });
                    }),
                state,
                '_id'
            );
        case CARDS_GET_CARDS_SUCCESS:
            return unionBy(
                action.payload.rows
                    .map(row => row.doc)
                    .filter(d => d.type === 'card')
                    .map(card => {
                        const card_to_index = assign({}, card, {
                            _index: undefined,
                            _id: undefined,
                            _rev: undefined,
                            type: undefined
                        }); // remove old _index
                        const _index = JSON.stringify(card_to_index)
                            .replace(/[^A-Za-z0-9!?]/g, '')
                            .toLowerCase();
                        return assign({}, card, { _index });
                    }),
                state,
                '_id'
            );

        default:
            return state;
    }
}

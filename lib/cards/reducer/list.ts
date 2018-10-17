import { ICard } from '../types';
import { unionBy } from 'lodash';
import { arrayToObject } from '../../core/utils';

import {
    CARDS_GET_CARDS_SUCCESS,
    CARDS_REM_TAG_SUCCESS,
    CARDS_ADD_TAG_SUCCESS,
    CARDS_UPDATE_CARD_SUCCESS,
    CARDS_DELETE_CARD_SUCCESS,
    CARDS_GET_CARD_SUCCESS,
    CARDS_CREATE_CARD_SUCCESS
} from '../constants';

import * as Tags from '../../tags';
import {
    USERS_GET_USER_SUCCESS,
    USERS_GET_USERS_SUCCESS
} from '../../users/actions';

import { FLOW_GET_ASSIGNMENTS_SUCCESS } from '../../flow/actions';

import { COLLECTIONS_GET_COLLECTIONS_SUCCESS } from 'lib/collections/actions';
import { FOLDERS_GET_FOLDERS_SUCCESS } from 'lib/folders/actions';

import * as Users from '../../users';

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
        case USERS_GET_USER_SUCCESS:
        case USERS_GET_USERS_SUCCESS:
        case Users.actions.USERS_INIT_USER_SUCCESS:

        case CARDS_GET_CARDS_SUCCESS:
        case CARDS_GET_CARD_SUCCESS:
        case Tags.actions.TAGS_ADD_TO_DOC_SUCCESS:
        case FLOW_GET_ASSIGNMENTS_SUCCESS:
        case COLLECTIONS_GET_COLLECTIONS_SUCCESS:
        case FOLDERS_GET_FOLDERS_SUCCESS:
            return unionBy(
                action.payload.filter(d => d.type === 'card'),
                state,
                '_id'
            );

        default:
            return state;
    }
}

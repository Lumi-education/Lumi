import { assign, unionBy } from 'lodash';

import { Map } from 'immutable';

import { ICompetenceRef } from '../types';

import { arrayToObject } from 'client/utils';

import {
    COMPETENCES_ADD_TO_DOC_REQUEST,
    COMPETENCES_REM_FROM_DOC_REQUEST,
    COMPETENCES_GET_COMPETENCES_SUCCESS
} from '../actions';

const defaultCompetenceRef = {};

export default function(
    state: Map<string, ICompetenceRef> = Map<string, ICompetenceRef>({}),
    action
): Map<string, ICompetenceRef> {
    switch (action.type) {
        case COMPETENCES_ADD_TO_DOC_REQUEST:
            return state.set(action.doc_id + action.competence_id, {
                doc_id: action.doc_id,
                competence_id: action.competence_id,
                type: 'competence_ref'
            });

        case COMPETENCES_REM_FROM_DOC_REQUEST:
            return state.delete(action.doc_id + action.competence_id);

        case COMPETENCES_GET_COMPETENCES_SUCCESS:
        case 'DB_CHANGE':
            return state.merge(
                Map<string, ICompetenceRef>(
                    arrayToObject(
                        action.payload.filter(d => d.type === 'competence_ref')
                    )
                )
            );

        default:
            return state;
    }
}

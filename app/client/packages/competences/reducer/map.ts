import { assign, unionBy } from 'lodash';

import { Map } from 'immutable';

import { ICompetence } from '../types';

import { arrayToObject } from 'client/utils';

import {
    COMPETENCES_GET_COMPETENCES_SUCCESS,
    COMPETENCES_CREATE_COMPETENCE_SUCCESS,
    COMPETENCES_DELETE_COMPETENCE_REQUEST
} from '../actions';

export default function(
    state: Map<string, ICompetence> = Map<string, ICompetence>({}),
    action
): Map<string, ICompetence> {
    switch (action.type) {
        case COMPETENCES_GET_COMPETENCES_SUCCESS:
        case 'DB_CHANGE':
            return state.merge(
                Map<string, ICompetence>(
                    arrayToObject(
                        action.payload.filter(d => d.type === 'competence')
                    )
                )
            );

        case COMPETENCES_CREATE_COMPETENCE_SUCCESS:
            const o = {};
            o[action.payload._id] = action.payload;
            return state.merge(Map<string, ICompetence>(o));

        case COMPETENCES_DELETE_COMPETENCE_REQUEST:
            return state.delete(action.competence_id);

        default:
            return state;
    }
}

import { Map } from 'immutable';

import { ICompetence, IState } from './types';

export function select_all_competences(state: IState): ICompetence[] {
    return state.competences.map.toArray();
}

export function select_competences_as_map(
    state: IState
): Map<string, ICompetence> {
    return state.competences.map;
}

export function select_competence_ids_for_doc(
    state: IState,
    doc_id: string
): string[] {
    return state.competences.refs
        .toArray()
        .filter(ref => ref.doc_id === doc_id)
        .map(ref => ref.competence_id);
}

export function select_competence(state: IState, competence_id): ICompetence {
    return state.competences.map.get(competence_id, {
        _id: undefined,
        type: 'competence',
        name: 'competence not found',
        short_name: '404',
        description: 'competence not found',
        color: 'red',
        created_at: new Date()
    });
}

export function select_competence_by_doc_id(
    state: IState,
    doc_id: string
): ICompetence {
    const competence_id = state.competences.refs
        .toArray()
        .filter(ref => ref.doc_id === doc_id)
        .map(ref => ref.competence_id)[0];

    return select_competence(state, competence_id);
}

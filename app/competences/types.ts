import { Map } from 'immutable';
type Competence_id = string;

export interface ICompetence {
    _id: Competence_id;
    type: 'competence';
    name: string;
    short_name: string;
    description: string;
    color: string;
    created_at: Date;
}

export interface ICompetenceRef {
    _id?: string;
    doc_id: string;
    competence_id: Competence_id;
    type: 'competence_ref';
    created_at?: Date;
    updated_at?: Date;
}

export interface IState {
    competences: {
        map: Map<string, ICompetence>;
        refs: Map<string, ICompetenceRef>;
    };
}

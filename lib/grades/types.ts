import { Map } from 'immutable';

export interface IGrade {
    _id: string;
    created_at: Date;
    updated_at: Date;
    _rev: string;
    _attachments;
    score: number;
    user_id: string;
    note: string;
    ref_id?: string;
    type: 'grade';
    grade_type: string;
}

export interface IGradesUI {
    show_create_grades_dialog: boolean;
    user_id: string;
    grade_id: string;
}

export interface IState {
    grades: {
        map: Map<string, IGrade>;
        ui: IGradesUI;
    };
}
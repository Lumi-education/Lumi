import { IDoc } from 'lib/core/types';

export interface IAssignment extends IDoc {
    _id: string;
    _rev: string;
    _deleted: boolean;
    _attachments: {};
    user_id: string;
    material_id: string;
    type: 'assignment';
    completed: boolean;
    data: {
        finished?: number;
        opened?: number;
        score?: number;
        maxScore?: number;
        state?: any;
    };
    state: any;
    archived: boolean;
}

export interface IFlowUI {
    selected_assignments: string[]; // deprecate with universal selection module #286
    show_user_assign_dialog: boolean;
    assignment: any;
}

export interface IState {
    flow: {
        assignments: IAssignment[];
        ui: IFlowUI;
    };
}

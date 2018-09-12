export interface IAssignment {
    _id?: string;
    user_id: string;
    card_id: string; // h5p content_id ?
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
    updated_at?: Date;

    finished: number;
    time: number;
    archived: boolean;
    _deleted?: boolean;
    _attachments: any;
    _rev?: string;
    files: string[];
    sync: 'pending' | 'error' | 'success';
}

export interface IFlowUI {
    selected_assignments: string[];
    show_dialog: boolean;
    assignment: any;
}

export interface IState {
    flow: {
        assignments: IAssignment[];
        ui: IFlowUI;
    };
}

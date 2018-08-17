export interface IAssignment {
    _id?: string;
    user_id: string;
    card_id: string; // h5p content_id ?
    type: 'assignment';
    completed: boolean;
    data: any;
    state: any;
    score: number;
    updated_at?: Date;
    completed_at: Date;
    time: number;
    _deleted?: boolean;
    _attachments: any;
    _rev?: string;
}

export interface IFlowUI {
    selected_assignments: string[];
}

export interface IState {
    flow: {
        assignments: IAssignment[];
        ui: IFlowUI;
    };
}

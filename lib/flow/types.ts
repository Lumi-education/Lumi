export interface IAssignment {
    _id?: string;
    user_id: string;
    card_id: string; // h5p content_id ?
    type: 'assignment';
    completed: boolean;
    data: any;
    state: any;
    score: number;
    time: number;
}

export interface IState {
    flow: {
        assignments: IAssignment[];
    };
}

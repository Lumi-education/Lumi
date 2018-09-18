export type Activity_id = string;
export type Activity_types = 'login' | 'assignment_completed';

import { User_id } from 'lib/users/types';

export interface IActivity {
    _id: Activity_id;
    type: 'activity';
    user_id: User_id;
    activity_type: Activity_types;
    date: string;
    assignment_id?: string;
}

export interface IState {
    activity: {
        list: IActivity[];
    };
}

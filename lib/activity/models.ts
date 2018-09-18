import { assign } from 'lodash';

import { IActivity, Activity_id, Activity_types } from './types';
import { User_id } from '../users/types';

export class Activity implements IActivity {
    public _id: Activity_id;
    public type: 'activity';
    public activity_type: Activity_types;
    public user_id: User_id;
    public date: string;
    public assignment_id?: string;

    constructor(a?: IActivity) {
        return assign(
            this,
            {
                type: 'activity'
            },
            a
        );
    }

    public get_date(): Date {
        return new Date(this.date);
    }
}

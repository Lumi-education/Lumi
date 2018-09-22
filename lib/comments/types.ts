import { User_id } from '../users/types';
import { Markdown } from '../core/types';

import * as moment from 'moment';

export type Comment_id = string;

export interface IComment {
    _id: Comment_id;
    type: 'comment';
    from: User_id;
    from_name: string;
    to: User_id;
    user_id: User_id;
    ref_id: string;
    seen_by: User_id[];
    text: Markdown;
    date: string;
}

export interface IState {
    comments: {
        list: IComment[];
    };
}

import { assign } from 'lodash';

import { IComment, Comment_id } from './types';
import { User_id } from 'lib/users/types';
import { Markdown } from 'lib/core/types';

import * as moment from 'moment';

export class Comment implements IComment {
    public _id: Comment_id;
    public type: 'comment';
    public from: User_id;
    public from_name: string;
    public to: User_id;
    public user_id: User_id;
    public ref_id: string;
    public seen_by: User_id[];
    public text: Markdown;
    public date: string;

    constructor(c?: IComment) {
        return assign(
            this,
            {
                _id: undefined,
                type: 'comment',
                seen_by: []
            },
            c
        );
    }

    public get_date(): moment.Moment {
        return moment(this.date);
    }
}

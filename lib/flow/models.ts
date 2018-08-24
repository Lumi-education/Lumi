import { IAssignment } from './types';
import { assign } from 'lodash';
import * as moment from 'moment';
export class Assignment implements IAssignment {
    public _id: string;
    public user_id: string;
    public card_id: string; // h5p content_id ?
    public completed: boolean;
    public data: {
        finished?: number;
        opened?: number;
        score?: number;
        maxScore?: number;
    };
    public state: any;
    public updated_at?: Date;
    public score: number;
    public time: number;
    public archived: boolean;
    public _deleted?: boolean;
    public _attachments: any;
    public finished: number;
    public _rev?: string;
    public type: 'assignment';

    constructor(assignment?: IAssignment) {
        return assign(
            this,
            {
                _id: null,
                card_id: null,
                user_id: null,
                type: 'assignment',
                completed: false,
                data: null,
                archived: false,
                score: null,
                state: null,
                time: 0,
                finished: null,
                _attachments: {}
            },
            assignment
        );
    }

    public get_score(): number {
        return this.score; // this.data.score / this.data.maxScore;
    }

    public get_finished(): string {
        return this.finished === null
            ? null
            : moment(this.finished).format('llll');
    }
}

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
    public time: number;
    public archived: boolean;
    public _deleted?: boolean;
    public _attachments: any;
    public finished: number;
    public _rev?: string;
    public sync: 'pending' | 'error' | 'success';
    public type: 'assignment';
    public files: string[];

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
                sync: 'success',
                finished: null,
                _attachments: {},
                files: []
            },
            assignment
        );
    }

    public get_score(): number {
        if (this.data === null) {
            return null;
        }
        const score = (this.data.score / this.data.maxScore) * 100;

        if (isNaN(score)) {
            return null;
        }

        return score;
    }

    public get_finished(): string {
        if (this.data) {
            if (this.data.finished) {
                return moment(this.data.finished).format('llll');
            }
        }
        return this.finished === null
            ? null
            : moment(this.finished).format('llll');
    }

    public add_file(path: string): string[] {
        return [...this.files, path];
    }
}

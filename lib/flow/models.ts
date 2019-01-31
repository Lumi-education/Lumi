import { IAssignment } from './types';
import { assign } from 'lodash';
import * as moment from 'moment';

export class Assignment implements IAssignment {
    public _id: string;
    public _rev: string;
    public _deleted: boolean;
    public _attachments: {};
    public user_id: string;
    public material_id: string;
    public completed: boolean;
    public data: {
        finished?: number;
        opened?: number;
        score?: number;
        maxScore?: number;
    };
    public state: any;
    public archived: boolean;
    public type: 'assignment';

    constructor(assignment?) {
        return assign(
            this,
            {
                _id: null,
                material_id: null,
                user_id: null,
                type: 'assignment',
                completed: false,
                data: null,
                archived: false,
                state: null,
                _attachments: {}
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
    }
}

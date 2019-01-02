import { assign } from 'lodash';
import { IUser } from './types';

export class User implements IUser {
    public _id: string;
    public _rev: string;
    public _deleted: boolean;
    public _attachments: any;
    public type: 'user';
    public name: string;
    public level: number;
    public groups: string[];
    public password: string;
    public flow: string[];

    constructor(u?: any) {
        assign(
            this,
            {
                _id: undefined,
                _rev: undefined,
                type: 'user',
                name: '',
                level: 0,
                groups: [],
                flow: [],
                _deleted: false,
                _attachments: {}
            },
            u
        );
    }
}

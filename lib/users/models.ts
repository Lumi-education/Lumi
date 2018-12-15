import { assign } from 'lodash';
import { IUser } from './types';

export class User implements IUser {
    public _id: string;
    public _deleted: boolean;
    public type: 'user';
    public name: string;
    public level: number;
    public groups: string[];
    public last_login: Date;
    public last_active: Date;
    public online: boolean;
    public location: string;
    public password: string;
    public flow: string[];

    constructor(u?: any) {
        assign(
            this,
            {
                _id: undefined,
                type: 'user',
                name: 'no name',
                level: 0,
                groups: [],
                last_login: undefined,
                last_active: undefined,
                online: false,
                location: '/',
                flow: [],
                _deleted: false
            },
            u
        );
    }
}

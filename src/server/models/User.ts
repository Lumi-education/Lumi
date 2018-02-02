import { assign } from 'lodash';

import Group from './Group';

export default class User {
    public _id: string;
    public type: 'user';
    public name: string;
    public level: number;
    public password: string;
    public groups: string[];
    public last_login: Date;
    public last_active: Date;
    public online: boolean;
    public location: string;

    constructor(u?) {
        return assign(
            this,
            {
                type: 'user',
                level: 1,
                name: 'new user',
                groups: [],
                online: false
            },
            u
        );
    }

    public add_group(group_id: string): void {
        this.groups.push(group_id);
    }

    public rem_group(group_id: string): void {
        this.groups = this.groups.filter(g => g !== group_id);
    }
}

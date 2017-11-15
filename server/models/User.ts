import { assign } from 'lodash';
import { IUser, Group_id } from '../../lib/types';

import Group from './Group';

import { DB } from '../db';
import Relations from '../db/relations';

export default class User extends Relations implements IUser {
    public _id: string;
    public type: 'user';
    public name: string;
    public level: number;
    public groups: Group_id[];

    constructor(u?) {
        super();
        return assign(
            this,
            {
                type: 'user',
                level: 1,
                name: 'new user',
                groups: []
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

    public get_groups(db: DB, cb: (tags: Group[]) => void): void {
        this.hasMany(db, this.groups, cb, Group);
    }
}

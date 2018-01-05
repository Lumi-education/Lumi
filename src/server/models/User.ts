import { assign } from 'lodash';
import { Group_id } from 'common/types';
import { IUser } from 'client/packages/users/types';

import Group from './Group';

import { DB } from '../db';
import Relations from '../db/relations';

export default class User extends Relations implements IUser {
    public _id: string;
    public type: 'user';
    public name: string;
    public level: number;
    public password: string;
    public groups: Group_id[];
    public last_login: Date;
    public last_active: Date;

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

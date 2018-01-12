import { assign, uniq } from 'lodash';
import { IGroup } from 'lib/groups/types';

import { DB } from '../db';
import { IUser } from 'lib/users';

export default class Group implements IGroup {
    public _id: string;
    public type: 'group';
    public name: string;
    public assigned_collections: string[];
    public active_collections: string[];
    public created_at: Date;

    constructor(g?: Group) {
        return assign(
            this,
            {
                type: 'group',
                name: 'new Group',
                assigned_collections: [],
                active_collections: [],
                created_at: new Date()
            },
            g
        );
    }

    public set_name(name: string): void {
        this.name = name;
    }

    public add_collection(collection_id: string): void {
        this.assigned_collections.push(collection_id);

        this.assigned_collections = uniq(this.assigned_collections);
    }

    public rem_collection(collection_id: string): void {
        this.assigned_collections = this.assigned_collections.filter(
            id => id !== collection_id
        );
    }

    public enable_collection(collection_id: string): void {
        this.active_collections.push(collection_id);
        if (this.assigned_collections.indexOf(collection_id) === -1) {
            this.add_collection(collection_id);
        }

        this.active_collections = uniq(this.active_collections);
    }

    public disable_collection(collection_id: string): void {
        this.active_collections = this.active_collections.filter(
            id => id !== collection_id
        );
    }

    public get_users(db: DB, cb: (users: IUser[]) => void) {
        db.view('group', 'user', { key: this._id }, cb);
    }
}

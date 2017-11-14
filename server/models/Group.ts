import { assign } from 'lodash';
import { IGroup, Collection_id } from 'lib/types';

import Collection from './Collection';

import { DB } from '../db';
import Relations from '../db/relations';


export default class Group extends Relations implements IGroup {
    public _id: string;
    public type: 'group';
    public name: string;
    public assigned_collections: Collection_id[];
    public created_at: Date;

    constructor(g?: Group) {
        super();
        return assign(
            this,
            {
                type: 'group',
                name: 'new Group',
                assigned_collections: [],
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
    }

    public rem_collection(collection_id: string): void {
        this.assigned_collections = this.assigned_collections.filter(
            id => id !== collection_id
        );
    }

    public get_collections(
        db: DB,
        cb: (collections: Collection[]) => void
    ) {
        this.hasMany(db, this.assigned_collections, cb, Collection);
    }
}

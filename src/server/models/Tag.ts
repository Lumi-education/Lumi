import { assign } from 'lodash';
import { ITag } from 'lib/tags/types';

import { DB } from '../db';

export default class Tag implements ITag {
    public _id: string;
    public type: 'tag';
    public name: string;
    public description: string;
    public created_at: Date;
    public short_name: string;
    public color: string;

    constructor(t?: Tag) {
        return assign(
            this,
            {
                type: 'tag',
                name: 'new Tag',
                short_name: t.name.substring(0, 3) || 'new',
                color: '#BCBCBC',
                description: '',
                created_at: new Date()
            },
            t
        );
    }

    public set_name(name: string): void {
        this.name = name;
    }
}

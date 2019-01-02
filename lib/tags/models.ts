import { ITag } from './types';
import { assign } from 'lodash';

export class Tag implements ITag {
    public _id: string;
    public type: 'tag';
    public name: string;
    public short_name: string;
    public description: string;
    public color: string;
    public created_at: Date;

    constructor(t?) {
        assign(
            this,
            {
                _id: undefined,
                type: 'tag',
                name: '',
                short_name: '',
                description: '',
                color: 'grey',
                created_at: new Date()
            },
            t
        );
    }
}

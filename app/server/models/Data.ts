import { assign } from 'lodash';
import { IData } from 'common/types';

import { DB } from '../db';
import Relations from '../db/relations';

export default class Data extends Relations implements IData {
    public _id: string;
    public type: 'data';
    public data_type: string;
    public collection_id: string;
    public user_id: string;
    public score: number;

    constructor(c?) {
        super();
        return assign(
            this,
            {
                type: 'data'
            },
            c
        );
    }
}

import { assign } from 'lodash';
import { IBaseData } from 'client/packages/cards/types';

import { DB } from '../db';
import Relations from '../db/relations';

export default class Data extends Relations implements IBaseData {
    public _id: string;
    public type: 'data';
    public data_type: 'card';
    public card_id: string;
    public collection_id: string;
    public user_id: string;
    public score: number;
    public created_at: Date;
    public updated_at: Date;

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

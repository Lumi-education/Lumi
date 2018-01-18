import { DB } from '../db';
import { noop } from 'lodash';
import { ICollectionData } from 'lib/cards/types';

export function assign_collection(
    db: DB,
    user_id: string,
    collection_id: string,
    is_graded: boolean,
    cb?: () => void
) {
    const data: ICollectionData = {
        collection_id,
        user_id,
        _id: user_id + '-' + collection_id,
        data_type: 'collection',
        submitted: false,
        submit_date: undefined,
        score: 0,
        type: 'data',
        is_graded: true,
        created_at: new Date(),
        updated_at: undefined
    };

    db.insert(data, cb);
}

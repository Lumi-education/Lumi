import { DB } from '../../db';
import event from '../../core/event';

import { ICollectionData } from 'lib/cards/types';

export function submit_overdue_collections() {
    const db = new DB(null, process.env.DB);

    db.find(
        {
            due_date: { $lte: new Date() },
            submitted: false,
            type: 'data',
            data_type: 'collection'
        },
        { limit: 30 },
        docs => {
            docs.forEach(doc => {
                doc.submitted = true;
                db.save(doc);
                event.emit('COLLECTIONS/COLLECTION_SUBMITTED', doc);
            });
        }
    );
}

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

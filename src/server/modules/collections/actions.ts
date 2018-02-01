import { assign } from 'lodash';
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
            docs.forEach(doc => submit_collection(doc._id));
        }
    );
}

export function submit_collection(id: string) {
    const db = new DB(null, process.env.DB);

    // collection_data.submitted = true;
    // collection_data.submit_date = new Date();
    const user_id = id.split('-')[0];
    const collection_id = id.split('-')[1];

    db.find(
        {
            collection_id,
            user_id,
            type: 'data',
            data_type: 'card',
            is_graded: true
        },
        { limit: 40 },
        data => {
            const correct = data
                .filter(
                    d =>
                        d.data_type === 'card' &&
                        d.card_type !== 'video' &&
                        d.card_type !== 'text'
                )
                .reduce((p, a) => p + (a.score || 0), 0);

            const num_tasks = data.filter(
                d =>
                    d.data_type === 'card' &&
                    d.card_type !== 'video' &&
                    d.card_type !== 'text'
            ).length;

            // collection_data.score = correct / num_tasks;

            db.update_one(
                id,
                {
                    submitted: true,
                    submit_date: new Date(),
                    score: correct / num_tasks
                },
                doc => {
                    event.emit('COLLECTIONS/COLLECTION_SUBMITTED', doc);
                }
            );

            // db.save(collection_data, () => {

            // });
        }
    );
}

export function delete_assignment(id: string) {
    const db = new DB(null, process.env.DB);

    db.delete(id, () => {
        event.emit('COLLECTIONS/ASSIGNMENT_DELETED', { _id: id });
    });
}

export function assign_collection(
    db: DB,
    user_id: string,
    collection_data,
    cb?: (res) => void
) {
    const data: ICollectionData = assign(
        {
            user_id,
            collection_id: collection_data.collection_id,
            _id: user_id + '-' + collection_data.collection_id,
            data_type: 'collection',
            submitted: false,
            submit_date: undefined,
            score: 0,
            type: 'data',
            is_graded: true,
            created_at: new Date(),
            updated_at: undefined,
            due_date: undefined
        },
        collection_data
    );

    db.insert(data, res => {
        cb(res);
        event.emit(
            'COLLECTIONS/COLLECTION_ASSIGNED',
            assign(data, { _id: res.id })
        );
    });
}

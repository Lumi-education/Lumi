import event from '../../core/event';
import * as debug from 'debug';
import { DB } from '../../db';

import { ICollectionData } from 'lib/collections/types';
import { IGrade } from 'lib/grades/types';

const log = debug('lumi:modules:collections:events');

import * as actions from './actions';

export default function boot() {
    event.on('COLLECTIONS/COLLECTION_SUBMITTED', collection_data => {
        if (collection_data.is_graded) {
            actions.assign_grade({
                _id: undefined,
                _rev: undefined,
                _attachments: undefined,
                created_at: undefined,
                updated_at: undefined,
                user_id: collection_data.user_id,
                score: collection_data.score,
                note: '',
                type: 'grade',
                grade_type: 'Arbeitsblatt',
                ref_id: collection_data.collection_id
            });
        }
    });

    event.on(
        'COLLECTIONS/COLLECTION_UNSUBMITTED',
        (collection_data: ICollectionData) => {
            const db = new DB();

            db.find(
                {
                    type: 'grade',
                    ref_id: collection_data.collection_id,
                    user_id: collection_data.user_id
                },
                {},
                (grades: IGrade[]) => {
                    grades.forEach(grade => actions.delete_grade(grade._id));
                }
            );
        }
    );
}

import event from '../../core/event';
import * as debug from 'debug';

const log = debug('lumi:modules:collections:events');

import * as actions from './actions';
import { ICollectionData } from '../../../../lib/cards/types';

export default function boot() {
    event.on(
        'COLLECTIONS/COLLECTION_SUBMITTED',
        (collection_data: ICollectionData) => {
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
        }
    );
}

import event from '../../core/event';
import * as debug from 'debug';
import { DB } from '../../db';

import { ICollectionData } from 'lib/collections/types';
import { IGrade } from 'lib/grades/types';

const log = debug('lumi:modules:collections:events');

import * as actions from './actions';

export default function boot() {
    event.on(
        'COLLECTIONS/COLLECTION_SUBMITTED',
        (collection_data: ICollectionData) => {
            if (collection_data.auto_complete) {
                actions.complete_collection(collection_data._id);
            }
        }
    );
}

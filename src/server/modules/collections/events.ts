import event from '../../core/event';
import * as debug from 'debug';
import {DB} from '../../db';

import {ICollectionData} from 'lib/collections/types';
import {IGrade} from 'lib/grades/types';
import {IGroup} from 'lib/groups/types';

const log = debug('lumi:modules:collections:events');

import * as actions from './actions';

export default function boot() {
    event.on('COLLECTIONS/COLLECTION_SUBMITTED', (collection_data : ICollectionData) => {
        if (collection_data.auto_complete) {
            actions.complete_collection(collection_data._id);
        }
    });

    event.on('GROUPS/USER_ADDED', (user_id, group_id) => {
        const db = new DB();

        db.findById(group_id, (group : IGroup) => {
            group
                .flow_order
                .forEach(collection_id => {
                    actions.assign_collection(db, user_id, {collection_id});
                });
        });
    });
}

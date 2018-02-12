import event from '../../core/event';
import * as debug from 'debug';
import { assign } from 'lodash';
import { DB } from '../../db';

const log = debug('lumi:modules:cards:events');
import { ICollectionData, ICollection } from 'lib/collections/types';
import * as actions from './actions';

export default function boot() {
    event.on('COLLECTIONS/COLLECTION_ASSIGNED', (data: ICollectionData) => {
        const db = new DB();

        db.findById(data.collection_id, (collection: ICollection) => {
            collection.cards.forEach(card_id =>
                actions.create_card_data(
                    data.user_id,
                    data.collection_id,
                    card_id
                )
            );
        });
    });
}

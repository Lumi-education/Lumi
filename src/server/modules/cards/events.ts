import event from '../../core/event';
import * as debug from 'debug';
import { assign } from 'lodash';
import { DB } from '../../db';

const log = debug('lumi:modules:cards:events');
import { ICollectionData, ICollection } from 'lib/collections/types';
import { ICardData } from 'lib/cards/types';

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

    event.on(
        'COLLECTIONS/ASSIGNMENT_DELETED',
        (collection_data: ICollectionData) => {
            const db = new DB();

            db.find(
                {
                    type: 'data',
                    data_type: 'card',
                    user_id: collection_data.user_id,
                    collection_id: collection_data.collection_id
                },
                {},
                docs => {
                    docs.forEach((card_data: ICardData) =>
                        actions.delete_card_data(
                            card_data.user_id,
                            card_data.collection_id,
                            card_data.card_id
                        )
                    );
                }
            );
        }
    );
}

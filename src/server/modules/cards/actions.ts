import { assign } from 'lodash';
import { DB } from '../../db';
import event from '../../core/event';
import * as raven from 'raven';

import { ICollectionData, ICollection } from 'lib/collections/types';
import { ICardData, ICard } from 'lib/cards/types';

export function show_answer(data_id: string) {
    try {
        const db = new DB();

        db.update_one(data_id, { show_answer: true });
    } catch (err) {
        raven.captureException(err);
    }
}

export function create_card_data(
    user_id: string,
    collection_id: string,
    card_id: string
) {
    try {
        const db = new DB();

        db.findById(card_id, (card: ICard) => {
            switch (card.card_type) {
                case 'multiplechoice':
                    db.insert({
                        user_id,
                        collection_id,
                        card_id,
                        _id: user_id + '-' + collection_id + '-' + card_id,
                        type: 'data',
                        created_at: undefined,
                        updated_at: undefined,
                        score: 0,
                        card_type: 'multiplechoice',
                        items: [],
                        graded: true,
                        show_answer: false,
                        is_graded: true,
                        data_type: 'card'
                    });
                    break;
                default:
                    db.insert({
                        user_id,
                        collection_id,
                        card_id,
                        _id: user_id + '-' + collection_id + '-' + card_id,
                        type: 'data',
                        created_at: undefined,
                        updated_at: undefined,
                        score: 0,
                        card_type: 'text',
                        graded: false,
                        show_answer: false,
                        is_graded: false,
                        data_type: 'card'
                    });
            }
        });
    } catch (err) {
        raven.captureException(err);
    }
}

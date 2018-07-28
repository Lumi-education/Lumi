import {assign} from 'lodash';
import {DB} from '../../db';
import event from '../../core/event';
import * as raven from 'raven';

import {ICollectionData, ICollection} from '../../../../lib/collections/types';
import {ICardData, ICard} from '../../../../lib/cards/types';

export function show_answer(data_id: string) {
    try {
        const db = new DB();

        db.update_one(data_id, {show_answer: true});
    } catch (err) {
        raven.captureException(err);
    }
}

export function hide_answer(data_id: string) {
    try {
        const db = new DB();

        db.update_one(
            data_id,
            {
                show_answer: false
            },
            doc => event.emit('CARDS/CARD_DATA_UPDATED', doc)
        );
    } catch (err) {
        raven.captureException(err);
    }
}

export function delete_card_data(
    user_id: string,
    collection_id: string,
    card_id: string
) {
    const db = new DB();

    const id = user_id + '-' + collection_id + '-' + card_id;
    db.findById(id, doc => {
        db.delete(id, () => {
            event.emit('CARDS/CARD_DATA_DELETED', doc);
        });
    });
}

export function create_card_data(
    user_id: string,
    collection_id: string,
    card_id: string // ,
    // cb?: (res: any) => void
) {
    try {
        const db = new DB();

        db.findById(card_id, (card: ICard) => {
            switch (card.card_type) {
                case 'multiplechoice':
                    db.insert(
                        {
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
                            group_id: 'test',
                            graded: true,
                            processed: false,
                            show_answer: false,
                            is_graded: true,
                            data_type: 'card'
                        },
                        doc => {
                            event.emit('CARDS/CARD_DATA_CREATED', doc);
                        }
                    );
                    break;
                case 'video':
                    db.insert(
                        {
                            user_id,
                            collection_id,
                            card_id,
                            _id: user_id + '-' + collection_id + '-' + card_id,
                            type: 'data',
                            created_at: undefined,
                            updated_at: undefined,
                            card_type: 'video',
                            group_id: 'test',
                            processed: false,
                            show_answer: false,
                            is_graded: false,
                            data_type: 'card',
                            graded: true,
                            score: 0
                        },
                        doc => {
                            event.emit('CARDS/CARD_DATA_CREATED', doc);
                        }
                    );
                    break;
                case 'upload':
                    db.insert(
                        {
                            user_id,
                            collection_id,
                            card_id,
                            _id: user_id + '-' + collection_id + '-' + card_id,
                            type: 'data',
                            created_at: undefined,
                            updated_at: undefined,
                            card_type: 'upload',
                            processed: false,
                            data_type: 'card',
                            group_id: 'test',
                            is_graded: true,
                            show_answer: false,
                            score: 0,
                            graded: false,
                            _attachments: undefined
                        },
                        doc => {
                            event.emit('CARDS/CARD_DATA_CREATED', doc);
                        }
                    );
                    break;
                case 'freetext':
                    db.insert(
                        {
                            user_id,
                            collection_id,
                            card_id,
                            _id: user_id + '-' + collection_id + '-' + card_id,
                            type: 'data',
                            created_at: undefined,
                            updated_at: undefined,
                            score: 0,
                            show_answer: false,
                            processed: false,
                            card_type: 'freetext',
                            answer: '',
                            group_id: 'test',
                            is_graded: true,
                            graded: false,
                            auto_grade: card.auto_grade,
                            data_type: 'card'
                        },
                        doc => {
                            event.emit('CARDS/CARD_DATA_CREATED', doc);
                        }
                    );
                case 'text':
                default:
                    db.insert(
                        {
                            user_id,
                            collection_id,
                            card_id,
                            _id: user_id + '-' + collection_id + '-' + card_id,
                            type: 'data',
                            created_at: undefined,
                            updated_at: undefined,
                            processed: false,
                            score: 0,
                            group_id: 'test',
                            card_type: 'text',
                            graded: false,
                            show_answer: false,
                            is_graded: false,
                            data_type: 'card'
                        },
                        doc => {
                            event.emit('CARDS/CARD_DATA_CREATED', doc);
                        }
                    );
            }
        });
    } catch (err) {
        raven.captureException(err);
    }
}

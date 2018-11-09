import event from '../../core/event';
import * as debug from 'debug';

import db from '../../db';

import * as actions from './actions';

const log = debug('lumi:events:flow');

export default function boot() {
    log('setting up events');
    event.on(
        'GROUPS/USER_ASSIGNED',
        (group_id: string, user_id: string, options) => {
            log('GROUPS/USER_ASSIGNED', group_id, user_id, options);

            db.findById(group_id, (error, group) => {
                group.cards.forEach(card_id => {
                    actions.assign(user_id, card_id, options);
                });
            });
        }
    );

    event.on('GROUPS/CARDS_ADDED', (group_id: string, card_ids: string[]) => {
        db.find(
            { type: 'user', groups: { $in: [group_id] } },
            {},
            (find_users_error, users) => {
                if (users && !find_users_error) {
                    users.forEach(user => {
                        card_ids.forEach(card_id => {
                            actions.assign(user._id, card_id, {});
                        });
                    });
                }
            }
        );
    });
}

export const FLOW_ASSIGN_REQUEST = 'FLOW_ASSIGN_REQUEST';
export const FLOW_ASSIGN_SUCCESS = 'FLOW_ASSIGN_SUCCESS';
export const FLOW_ASSIGN_ERROR = 'FLOW_ASSIGN_ERROR';

import * as API from './api';

export function assign(group_id : string, user_ids : string[], card_ids : string[]) {
    return {
        types: [
            FLOW_ASSIGN_REQUEST, FLOW_ASSIGN_SUCCESS, FLOW_ASSIGN_ERROR
        ],
        api: API.assign(group_id, user_ids, card_ids),
        payload: {
            group_id,
            user_ids,
            card_ids
        }
    };
}
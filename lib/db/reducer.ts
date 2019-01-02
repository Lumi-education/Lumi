import { assign } from 'lodash';

import { IDBUI } from './types';

import db from './db';

import {
    DB_ACTIVE,
    DB_CHANGE,
    DB_COMPLETE,
    DB_DENIED,
    DB_ERROR,
    DB_PAUSED,
    DB_PENDING_DOCS
} from './actions';

const initialState: IDBUI = {
    state: 'init',
    pending_docs: 0,
    initial_docs: 0
};

export default function(state: IDBUI = initialState, action): IDBUI {
    switch (action.type) {
        case DB_ACTIVE:
            return assign({}, state, { state: 'active' });

        case DB_CHANGE:
            return assign({}, state, { state: 'change' });

        case DB_COMPLETE:
            return assign({}, state, { state: 'complete' });

        case DB_DENIED:
            return assign({}, state, { state: 'denied' });

        case DB_ERROR:
            return assign({}, state, { state: 'error' });

        case DB_PAUSED:
            return assign({}, state, { state: 'paused' });

        case DB_PENDING_DOCS:
            return assign({}, state, {
                pending_docs: action.payload,
                initial_docs:
                    state.initial_docs === 0
                        ? action.payload
                        : state.initial_docs
            });

        case 'AUTH_LOGOUT_REQUEST':
            db.destroy();
            return state;

        default:
            return state;
    }
}

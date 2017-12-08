import { assign } from 'lodash';

import {
    SYSTEM_CHECK_DB_REQUEST,
    SYSTEM_CHECK_DB_ERROR,
    SYSTEM_CHECK_DB_SUCCESS
} from './actions';

import { ISystem } from './types';

const initialState: ISystem = {
    db: '',
    db_status: 'init'
};

export default function(state: ISystem = initialState, action): ISystem {
    switch (action.type) {
        default:
            return state;
    }
}

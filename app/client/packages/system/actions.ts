export const SYSTEM_CHECK_DB_REQUEST = 'SYSTEM_CHECK_DB_REQUEST';
export const SYSTEM_CHECK_DB_SUCCESS = 'SYSTEM_CHECK_DB_SUCCESS';
export const SYSTEM_CHECK_DB_ERROR = 'SYSTEM_CHECK_DB_ERROR';

import * as API from './api';

export function checkDb(db: string) {
    return {
        types: [
            SYSTEM_CHECK_DB_REQUEST,
            SYSTEM_CHECK_DB_SUCCESS,
            SYSTEM_CHECK_DB_ERROR
        ],
        api: API.checkDb(db)
    };
}

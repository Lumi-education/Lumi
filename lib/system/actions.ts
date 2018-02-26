export const SYSTEM_SHUTDOWN = 'SYSTEM_SHUTDOWN';

import * as api from './api';

export function shutdown() {
    return dispatch => {
        api.shutdown().then(res => {
            dispatch({ type: SYSTEM_SHUTDOWN });
        });
    };
}

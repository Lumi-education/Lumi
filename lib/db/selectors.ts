import * as Core from 'lib/core';

import { IState, DBState } from './types';

export function db_name(_state: IState): string {
    try {
        return window.location.pathname.split('/')[1] || 'lumi';
    } catch (error) {
        Core.raven.captureException(error);
        return '';
    }
}

export function state(_state: IState): DBState {
    try {
        return _state.db.state;
    } catch (error) {
        Core.raven.captureException(error);
        return 'init';
    }
}

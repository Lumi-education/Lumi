import { IState } from 'client/state';
import { Dispatch } from 'redux';
import * as debug from 'debug';
import { assign } from 'lodash';
import * as raven from 'raven-js';

const log = debug('lumi:core:store:action:');

export default function debugMiddleware({ dispatch, getState }) {
    return next => action => {
        log(action.type, action);

        raven.captureBreadcrumb({
            message: action.type,
            category: 'action',
            data: action
        });

        return next(action);
    };
}

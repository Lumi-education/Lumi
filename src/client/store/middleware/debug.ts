import { IState } from 'client/state';
import { Dispatch } from 'redux';
import * as debug from 'debug';
import { assign } from 'lodash';
import * as raven from 'raven-js';

const log = debug('lumi:core:store:action:');

export default function debugMiddleware({ dispatch, getState }) {
    return next => action => {
        log(action.type, action);

        // try {
        //     if (
        //         action.type.substring(
        //             action.type.length - 5,
        //             action.type.length
        //         ) === 'ERROR'
        //     ) {
        //         raven.captureMessage('ACTION', {
        //             level: 'error',
        //             extra: { action }
        //         });
        //     }
        // } catch (err) {
        //     raven.captureException(err);
        // }

        raven.captureBreadcrumb({
            message: action.type,
            category: 'action',
            data: action
        });

        return next(action);
    };
}

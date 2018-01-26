import { IState } from 'client/state';
import { Dispatch } from 'redux';
import * as debug from 'debug';
import { assign } from 'lodash';
import * as raven from 'raven-js';
declare var window;

const log = debug('lumi:core:store:middleware:ga-tracker');

export default function debugMiddleware({ dispatch, getState }) {
    return next => action => {
        if (
            action.type === '@@router/LOCATION_CHANGE' &&
            process.env.NODE_ENV === 'production'
        ) {
            try {
                window.ga('set', 'page', action.payload.pathname);
                window.ga('send', 'pageview');
                log('pageview', action.payload.pathname);
            } catch (err) {
                raven.captureException(err);
            }
        }
        return next(action);
    };
}

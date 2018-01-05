import { IState } from 'client/state';
import { Dispatch } from 'redux';
import * as debug from 'debug';
import { assign } from 'lodash';

declare var window;

const log = debug('lumi:core:store:middleware:ga-tracker');

export default function debugMiddleware({ dispatch, getState }) {
    return next => action => {
        if (action.type === '@@router/LOCATION_CHANGE') {
            try {
                window.ga('set', 'page', action.payload.pathname);
                window.ga('send', 'pageview');
                log('pageview', action.payload.pathname);
            } catch (err) {
                log(err);
            }
        }
        return next(action);
    };
}

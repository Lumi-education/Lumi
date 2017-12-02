import { IState } from 'client/state';
import { Dispatch } from 'redux';
import * as debug from 'debug';
import { assign } from 'lodash';

const log = debug('lumi:core:store:action:');

export default function debugMiddleware({ dispatch, getState }) {
    return next => action => {
        log(action.type, action);
        return next(action);
    };
}

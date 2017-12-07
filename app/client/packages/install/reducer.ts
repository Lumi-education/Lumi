import { assign } from 'lodash';

import { INSTALL_GET_STATUS_SUCCESS } from './actions';

import { IInstall } from './types';

const initialState: IInstall = {
    is_installed: false
};

export default function(state: IInstall = initialState, action): IInstall {
    switch (action.type) {
        case INSTALL_GET_STATUS_SUCCESS:
            return action.payload;

        default:
            return state;
    }
}

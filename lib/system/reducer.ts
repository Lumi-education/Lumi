import { assign, uniq } from 'lodash';

import { ISystemSettings } from './types';

import { SYSTEM_GET_SETTINGS_SUCCESS } from './actions';

const initialState: ISystemSettings = {
    _id: 'system',
    enable_guest_accounts: false,
    auto_guest_login: false,
    auto_assign_to_groups: []
};

export default function(
    state: ISystemSettings = initialState,
    action
): ISystemSettings {
    switch (action.type) {
        case SYSTEM_GET_SETTINGS_SUCCESS:
            return action.payload;

        default:
            return state;
    }
}

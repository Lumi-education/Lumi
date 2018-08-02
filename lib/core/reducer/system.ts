import { ISystemSettings } from '../types';

import { SYSTEM_GET_SETTINGS_SUCCESS } from '../actions';

const initialState: ISystemSettings = {
    _id: 'system',
    changes_port: 3001
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

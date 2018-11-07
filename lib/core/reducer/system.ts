import { ISystemSettings } from '../types';

import { SYSTEM_GET_SETTINGS_SUCCESS } from '../actions';

const initialState: ISystemSettings = {
    _id: 'system',
    mode: 'free',
    controlled_location: '/',
    allow_user_registration: true,
    provide_password: false,
    ip: undefined,
    port: undefined,
    target: undefined
};

export default function(
    state: ISystemSettings = initialState,
    action
): ISystemSettings {
    switch (action.type) {
        case 'DB_CHANGE':
            return action.payload.filter(d => d._id === 'system')[0] || state;

        case SYSTEM_GET_SETTINGS_SUCCESS:
            return action.payload;

        default:
            return state;
    }
}

import raven from '../raven';
import { ISystemSettings } from '../types';

import { SYSTEM_GET_SETTINGS_SUCCESS } from '../actions';

const initialState: ISystemSettings = {
    _id: 'system',
    type: 'system',
    mode: 'free',
    controlled_location: '/',
    allow_user_registration: true,
    provide_password: false,
    ip: undefined,
    port: undefined,
    target: undefined,
    installed: false
};

export default function(
    state: ISystemSettings = initialState,
    action
): ISystemSettings {
    try {
        switch (action.type) {
            case 'DB_CHANGE':
                return action.payload.filter(d => d._id === 'core')[0]
                    ? { ...state, installed: true }
                    : state;

            case SYSTEM_GET_SETTINGS_SUCCESS:
                return {
                    ...state,
                    installed: true
                };

            default:
                return state;
        }
    } catch (error) {
        raven.captureException(error);
        return state;
    }
}

import { IState, ISystemSettings } from './types';

export function system_settings(state: IState): ISystemSettings {
    return state.core.system;
}

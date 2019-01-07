import * as semver from 'semver';
import raven from './raven';

import { IState, ISystemSettings } from './types';

export function system_settings(state: IState): ISystemSettings {
    try {
        return state.core.system;
    } catch (error) {
        raven.captureException(error);
        return {
            _id: 'system',
            type: 'system',
            mode: 'free',
            ip: '',
            allow_user_registration: true,
            controlled_location: '/',
            provide_password: true,
            installed: true,
            port: '80',
            target: 'pi'
        };
    }
}

export function update_available(state: IState): boolean {
    try {
        const system_version = semver.coerce(process.env.VERSION).version;
        const update_version = semver.coerce(state.core.status.update.tag_name)
            .version;

        return semver.lt(system_version, update_version);
    } catch (error) {
        raven.captureException(error);
        return false;
    }
}

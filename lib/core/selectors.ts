import * as semver from 'semver';

import { IState, ISystemSettings } from './types';

export function system_settings(state: IState): ISystemSettings {
    return state.core.system;
}

export function update_available(state: IState): boolean {
    const system_version = semver.coerce(process.env.VERSION).version;
    const update_version = semver.coerce(state.core.status.update.tag_name)
        .version;

    return semver.lt(system_version, update_version);
}

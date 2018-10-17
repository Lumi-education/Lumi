import raven from '../core/raven';

import { IState } from './types';

import { Folder } from './models';

export function all(state: IState): Folder[] {
    try {
        return state.folders.list.map(c => new Folder(c));
    } catch (error) {
        raven.captureException(error);
        return [];
    }
}
export function id(state: IState, folder_id: string): Folder {
    return new Folder(state.folders.list.filter(f => f._id === folder_id)[0]);
}

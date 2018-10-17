import { assign } from 'lodash';

import { IFolder, Folder_id, IFolderContent } from './types';

export class Folder implements IFolder {
    public _id: Folder_id;
    public type: 'folder';
    public name: string;
    public content: IFolderContent[];

    constructor(c?: IFolder) {
        return assign(
            this,
            {
                _id: undefined,
                type: 'folder',
                content: []
            },
            c
        );
    }
}

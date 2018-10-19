export type Folder_id = string;

export interface IFolder {
    _id: Folder_id;
    type: 'folder';
    name: string;
    content: IFolderContent[];
}

export interface IFolderContent {
    type: 'card' | 'folder';
    _id: string;
}

export interface IFolderUI {
    selected_folder: string;
}

export interface IState {
    folders: {
        list: IFolder[];
        ui: IFolderUI;
    };
}

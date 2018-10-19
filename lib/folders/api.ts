import * as request from 'superagent';

import { Folder } from './models';

declare var window;

export function create_folder(name: string, in_folder: string) {
    return request
        .post('/api/v0/folders')
        .send({
            in_folder,
            folder: new Folder({
                name,
                _id: undefined,
                type: 'folder',
                content: []
            })
        })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_folders() {
    return request
        .get('/api/v0/folders')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function add_material(folder_id: string, _ids: string[]) {
    return request
        .post('/api/v0/folders/' + folder_id)
        .send({ _ids })
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

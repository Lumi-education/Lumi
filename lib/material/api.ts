import * as debug from 'debug';
import * as request from 'superagent';
import { IMaterial } from './types';

import * as DB from 'lib/db';

const log_info = debug('lumi:info:material:api');

declare var window;

export function create(material: IMaterial): Promise<IMaterial[]> {
    log_info('create', material);
    return request
        .post('/api/v1/' + window.location.pathname.split('/')[1] + '/material')
        .send(material)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function update(material: IMaterial): Promise<IMaterial> {
    return request
        .put(
            '/api/v1/' +
                window.location.pathname.split('/')[1] +
                '/material/' +
                material._id
        )
        .send(material)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function destroy(material_id: string): Promise<any> {
    return request
        .delete(
            '/api/v1/' +
                window.location.pathname.split('/')[1] +
                '/material/' +
                material_id
        )
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function upload_h5p(
    material_id: string,
    file: FormData
): Promise<IMaterial> {
    log_info('upload_h5p', material_id, file);
    return request
        .post(
            '/api/v1/' +
                window.location.pathname.split('/')[1] +
                '/h5p?content_id=' +
                material_id
        )
        .send(file)
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

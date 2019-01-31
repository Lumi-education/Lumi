import * as debug from 'debug';
import * as raven from 'raven';
import * as express from 'express';

import DB from '../db_v1';
import { IDB } from '../db_v1/interface';
import { IH5PMaterial } from 'lib/material/types';

const log_error = debug('lumi:error:h5p:interface:generate_id');
const log_info = debug('lumi:info:h5p:interface:generate_id');

export default function generate_id(req: express.Request): Promise<string> {
    return new Promise((resolve, reject) => {
        const db_name = req.baseUrl.split('/')[3];
        const db: IDB = new DB(db_name);

        log_info('generating id', db_name);

        const material: IH5PMaterial = {
            _id: undefined,
            _attachments: {},
            _deleted: false,
            _rev: undefined,
            material_type: 'h5p',
            type: 'material',
            name: '',
            index: '',
            h5p: {
                title: '',
                language: 'u',
                machineName: undefined,
                mainLibrary: undefined,
                embedTypes: [],
                license: 'U',
                majorVersion: undefined,
                minorVersion: undefined,
                preloadedDependencies: [],
                preloadedCss: [],
                preloadedJs: []
            },
            content: {}
        };

        db.insert<IH5PMaterial>(material).then(m => {
            log_info('id generated', m.id);
            resolve(m.id);
        });
    });
}

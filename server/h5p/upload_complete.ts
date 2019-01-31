import * as debug from 'debug';
import * as raven from 'raven';
import * as express from 'express';
import * as Screenshot from 'url-to-screenshot';

import DB from '../db_v1';
import { IDB } from '../db_v1/interface';
import { IMaterial } from 'lib/material/types';

const log_error = debug('lumi:error:h5p:interface:upload_complete');
const log_info = debug('lumi:info:h5p:interface:upload_complete');

export default function upload_complete(req: express.Request): Promise<{}> {
    return new Promise((resolve, reject) => {
        const content_id = req.query.content_id;
        log_info(content_id, 'creating screenshot');
        const db_name = req.baseUrl.split('/')[3];
        const db: IDB = new DB(db_name);
        new Screenshot(
            'http://localhost:' +
                process.env.PORT +
                req.baseUrl +
                '?content_id=' +
                content_id
        )
            .width(300)
            .height(200)
            .timeout(500)
            .capture()
            .then(img => {
                img
                    ? log_info(content_id, 'screenshot created')
                    : log_error(content_id, 'image is not defined.');
                db.saveAttachment(content_id, 'preview.png', img, 'image/png')
                    .then(res => {
                        log_info(content_id, 'preview image saved to db');

                        db.findById<IMaterial>(content_id).then(material => {
                            material.index = JSON.stringify(material)
                                .replace(/[^a-zA-Z0-9 -]/g, '')
                                .toLowerCase();

                            db.updateOne(material).then(update_material_res => {
                                resolve();
                            });
                        });
                    })
                    .catch(error => {
                        log_error(error);
                        raven.captureException(error);
                        reject(error);
                    });
            });
    });
}

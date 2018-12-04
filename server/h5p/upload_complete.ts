import * as debug from 'debug';

import * as Screenshot from 'url-to-screenshot';

import db from '../db';

const error = debug('lumi:error:h5p:interface:upload_complete');
const info = debug('lumi:info:h5p:interface:upload_complete');

export default function upload_complete(content_id: string) {
    info(content_id, 'creating screenshot');
    new Screenshot(
        'http://localhost:' + process.env.PORT + '/h5p?content_id=' + content_id
    )
        .width(300)
        .height(200)
        .capture()
        .then(img => {
            img
                ? info(content_id, 'screenshot created')
                : error(content_id, 'image is not defined.');
            db.saveAttachment(
                content_id,
                'preview.png',
                img,
                'image/png',
                (db_error, db_info) => {
                    db_error
                        ? error(db_error)
                        : info(content_id, 'preview image saved to db');
                }
            );
        });
}

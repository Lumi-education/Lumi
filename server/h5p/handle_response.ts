import * as debug from 'debug';
import * as raven from 'raven';
import * as express from 'express';

import DB from '../db_v1';
import { IDB } from '../db_v1/interface';
import { IMaterial } from 'lib/material/types';

const log_error = debug('lumi:error:h5p:interface:handle_response');
const log_info = debug('lumi:info:h5p:interface:handle_response');

export default function handle_response(
    req: express.Request,
    res: express.Response
): void {
    const content_id = req.query.content_id;
    const db_name = req.baseUrl.split('/')[3];
    const db: IDB = new DB(db_name);

    db.findById<IMaterial>(content_id).then(material => {
        res.status(200).json(material);
    });
}

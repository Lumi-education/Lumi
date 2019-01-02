import * as express from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jwt-simple';
import * as debug from 'debug';
import { assign } from 'lodash';
import * as raven from 'raven';
import { IRequest } from '../../middleware/auth';

import DB from '../../db_v1';
import { IDB } from '../../db_v1/interface';

import ErrorResponse from '../../core/error';

const log_info = debug('lumi:api:v1:system');

class SystemController {
    public system(req: IRequest, res: express.Response) {
        const db: IDB = new DB(req.params.db);

        db.findById('system')
            .then(system => {
                res.status(200).json(system);
            })
            .catch(error => {
                res.status(404).json(
                    new ErrorResponse(
                        'core',
                        'InvalidDB',
                        'system.invalid_db',
                        error
                    )
                );
            });
    }
}

export default new SystemController();

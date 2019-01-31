import * as express from 'express';
import * as debug from 'debug';
import { assign } from 'lodash';
import * as raven from 'raven';
import { IRequest } from '../../middleware/auth';

import DB from '../../db_v1';
import { IDB } from '../../db_v1/interface';
import { IMaterial } from 'lib/material/types';

import ErrorResponse from '../../core/error';
import { IAssignment } from 'lib/flow/types';

const log_info = debug('lumi:info:api:v1:material');
const log_error = debug('lumi:error:api:v1:material');

class MaterialController {
    public save_state(req: IRequest, res: express.Response) {
        try {
            const db: IDB = new DB(req.params.db);

            log_info('save_state', req.params.db, 'start');

            db.findById<IAssignment>(req.params.assignment_id).then(
                assignment => {
                    assignment.state = req.body.state
                        ? req.body.state
                        : req.body;

                    db.updateOne<IAssignment>(assignment).then(response => {
                        res.status(200).json(
                            assign({}, assignment, {
                                _id: response.id,
                                _rev: response.rev
                            })
                        );
                    });
                }
            );
        } catch (error) {
            log_error('create_material', req.params.db, error);
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse('core', 'ServerError', 'core.server_error')
            );
        }
    }

    public save_data(req: IRequest, res: express.Response) {
        try {
            const db: IDB = new DB(req.params.db);

            log_info('save_data', req.params.db, 'start');

            db.findById<IAssignment>(req.params.assignment_id).then(
                assignment => {
                    assignment.data = req.body;
                    assignment.state = req.body.state;
                    assignment.completed = true;

                    db.updateOne<IAssignment>(assignment).then(response => {
                        res.status(200).json(
                            assign({}, assignment, {
                                _id: response.id,
                                _rev: response.rev
                            })
                        );
                    });
                }
            );
        } catch (error) {
            log_error('create_material', req.params.db, error);
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse('core', 'ServerError', 'core.server_error')
            );
        }
    }

    public get_state(req: IRequest, res: express.Response) {
        try {
            const db: IDB = new DB(req.params.db);

            log_info('save_data', req.params.db, 'start');

            db.findById<IAssignment>(req.params.assignment_id).then(
                assignment => {
                    res.status(200).json(
                        assign(assignment.state, { success: true })
                    );
                }
            );
        } catch (error) {
            log_error('create_material', req.params.db, error);
            raven.captureException(error);
            res.status(500).json(
                new ErrorResponse('core', 'ServerError', 'core.server_error')
            );
        }
    }
}

export default new MaterialController();

import * as express from 'express';
import { assign } from 'lodash';
import { IRequest } from '../../middleware/auth';

import db from '../../db';

class GradesController {
    public user(req: IRequest, res: express.Response) {
        // db.view('grade', 'user', {key: req.params.user_id}, (error, grades) => {
        //     res.status(200).json(grades);
        // });
    }

    public create(req: IRequest, res: express.Response) {
        const default_grade = {
            _id: undefined,
            created_at: new Date(),
            _attachments: {},
            _rev: undefined,
            updated_at: undefined,
            score: 0,
            user_id: undefined,
            note: '',
            type: 'grade',
            grade_type: 'no'
        };

        db.insert(assign({}, default_grade, req.body), (error, doc) => {
            res.status(200).json([doc]);
        });
    }

    public update(req: IRequest, res: express.Response) {
        db.updateOne(req.params.id, req.body, (err, updated_doc) => {
            res.status(200).json(updated_doc);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        db.delete(req.params.id, error => {
            res.status(200).end();
        });
    }
}

export default GradesController;

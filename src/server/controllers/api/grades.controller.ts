import * as express from 'express';
import { assign, noop } from 'lodash';
import { IRequest } from '../../middleware/auth';

import { DB } from '../../db';

import Controller from '../controller';

class GradesController extends Controller<{}> {
    constructor() {
        const _view = {
            _id: '_design/grade',
            views: {
                user: {
                    map:
                        "function (doc) {\n  if (doc.type === 'grade') { \n  emit(doc.user_id, 1);\n  }\n}"
                }
            },
            language: 'javascript'
        };

        super('grade', _view);
    }

    public user(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view('grade', 'user', { key: req.params.user_id }, grades => {
            res.status(200).json(grades);
        });
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

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

        db.insert(assign({}, default_grade, req.body));
    }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.delete(req.params.id);
    }
}

export default GradesController;

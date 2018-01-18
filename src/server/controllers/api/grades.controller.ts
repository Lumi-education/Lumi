import * as express from 'express';
import { assign, noop } from 'lodash';
import { IRequest } from '../../middleware/auth';

import { IGrade } from 'lib/grades/types';
import { DB } from '../../db';

import Controller from '../controller';

class GradesController extends Controller<IGrade> {
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
        const db = new DB(res, req.params.db);

        db.view(
            'grade',
            'user',
            { key: req.params.user_id },
            (grades: IGrade[]) => {
                res.status(200).json(grades);
            }
        );
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        const default_grade: IGrade = {
            _id: undefined,
            created_at: new Date(),
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
        const db = new DB(res, req.params.db);

        db.delete(req.params.id);
    }
}

export default new GradesController();

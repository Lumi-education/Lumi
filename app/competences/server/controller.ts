import * as express from 'express';
import { assign, noop } from 'lodash';

import { ICompetence, ICompetenceRef } from '../types';

import { DB } from 'server/db';
import Competence from './model';
import Controller from 'server/controllers/controller';

interface IRequest extends express.Request {
    user: {
        _id: string;
    };
}

class CompetenceController extends Controller<ICompetence> {
    constructor() {
        const _view = {
            _id: '_design/competence',
            views: {
                by_doc: {
                    map:
                        "function (doc) {\n  if (doc.type === 'competence_ref') { \n    emit(doc.doc_id, { _id: doc.competence_id }); \n    emit(doc.doc_id, 1);\n  }\n}"
                },
                competence_with_docs: {
                    map:
                        "function (doc) {\n  if (doc.type === 'competence') { emit(doc._id, 1); }\n  if (doc.type === 'competence_ref') { emit(doc.competence_id, { _id: doc.doc_id }); }\n}"
                },
                list: {
                    map:
                        "function (doc) {\n  if (doc.type === 'competence' || doc.type === 'competence_ref') { emit(doc._id, 1); }\n}"
                }
            },
            language: 'javascript'
        };

        super('competence', _view);
    }

    public action(req: IRequest, res: express.Response) {
        const db = new DB(res);

        switch (req.body.type) {
            case 'ADD_TO_DOC':
                db.insert({
                    _id: req.body.payload.doc_id + req.params.id,
                    doc_id: req.body.payload.doc_id,
                    competence_id: req.params.id,
                    type: 'competence_ref'
                });
                break;
            case 'REM_FROM_DOC':
                db.delete(req.body.payload.doc_id + req.params.id);
                break;
            default:
                break;
        }
    }

    public list(req: IRequest, res: express.Response) {
        const db = new DB(res);

        if (req.query.doc_id) {
            db.view('competence', 'by_doc', { key: req.query.doc_id }, docs => {
                res.status(200).json(docs);
            });
        } else {
            db.view('competence', 'list', {}, docs => {
                res.status(200).json(docs);
            });
        }
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Competence(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view(
            'competence',
            'competence_with_docs',
            { key: req.params.id },
            docs => {
                res.status(200).json(docs);
            }
        );
    }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.find(
            {
                competence_id: req.params.id,
                type: 'competence_ref'
            },
            {},
            docs => {
                docs.forEach(doc => {
                    db.delete(doc._id, noop);
                });
            }
        );

        db.delete(req.params.id);
    }
}

export default new CompetenceController();

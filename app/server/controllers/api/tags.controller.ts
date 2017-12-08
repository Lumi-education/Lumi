import * as express from 'express';
import { assign, noop } from 'lodash';
import { IRequest } from '../../middleware/auth';

import { ITag, ITagRef } from 'client/packages/tags/types';
import Tag from '../../models/Tag';
import { DB } from '../../db';

import Controller from '../controller';

class TagsController extends Controller<Tag> {
    constructor() {
        const _view = {
            _id: '_design/tag',
            views: {
                by_doc: {
                    map:
                        "function (doc) {\n  if (doc.type === 'tag_ref') { \n    emit(doc.doc_id, { _id: doc.tag_id }); \n    emit(doc.doc_id, 1);\n  }\n}"
                },
                tag_with_docs: {
                    map:
                        "function (doc) {\n  if (doc.type === 'tag') { emit(doc._id, 1); }\n  if (doc.type === 'tag_ref') { emit(doc.tag_id, { _id: doc.doc_id }); }\n}"
                }
            },
            language: 'javascript'
        };

        super('tag', _view);
    }

    public action(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        switch (req.body.type) {
            case 'ADD_TO_DOC':
                db.insert({
                    _id: req.body.payload.doc_id + req.params.id,
                    doc_id: req.body.payload.doc_id,
                    tag_id: req.params.id,
                    type: 'tag_ref'
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
        const db = new DB(res, req.params.db);

        db.view('tag', 'by_doc', { key: req.query.doc_id }, docs => {
            res.status(200).json(docs);
        });
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.insert(new Tag(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.view('tag', 'tag_with_docs', { key: req.params.id }, docs => {
            res.status(200).json(docs);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.find(
            {
                tag_id: req.params.id,
                type: 'tag_ref'
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

export default new TagsController();

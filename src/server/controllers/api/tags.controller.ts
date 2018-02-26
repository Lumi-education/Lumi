import * as express from 'express';
import { assign, noop } from 'lodash';
import { IRequest } from '../../middleware/auth';

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
                        "function (doc) {\n  if (doc.type === 'tag_ref') { \n    doc.tags.forEach(function (tag_id) { emit(doc.doc_id, { _id: tag_id }); });\n    emit(doc.doc_id, 1);\n  }\n}"
                },
                tag_with_docs: {
                    map:
                        "function (doc) {\n  if (doc.type === 'tag') { emit(doc._id, 1); }\n  if (doc.type === 'tag_ref') { emit(doc.tag_id, { _id: doc.doc_id }); }\n}"
                },
                index: {
                    map:
                        "function (doc) {\n  if (doc.type === 'tag' || doc.type === 'tag_ref') { emit(doc._id, 1); }\n}"
                },
                indexRef: {
                    map:
                        "function (doc) {\n  if (doc.type === 'tag_ref') { emit(doc._id, 1); }\n}"
                }
            },
            language: 'javascript'
        };

        super('tag', _view);
    }

    public action(req: IRequest, res: express.Response) {
        const db = new DB(res);

        switch (req.body.type) {
            case 'ADD_TO_DOC':
                db._findById(
                    req.body.payload.doc_id + '-tags',
                    (err, tag_ref) => {
                        if (err) {
                            const _tag_ref = {
                                _id: req.body.payload.doc_id + '-tags',
                                doc_id: req.body.payload.doc_id,
                                tags: [req.params.id],
                                type: 'tag_ref'
                            };
                            db.insert(_tag_ref);
                        } else {
                            tag_ref.tags.push(req.params.id);
                            db.save(tag_ref);
                        }
                    }
                );
                break;
            case 'REM_FROM_DOC':
                db.findById(req.body.payload.doc_id + '-tags', tag_ref => {
                    tag_ref.tags = tag_ref.tags.filter(
                        tag_id => tag_id !== req.params.id
                    );
                    db.save(tag_ref);
                });
                break;
            default:
                break;
        }
    }

    public index(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view('tag', 'index', { key: req.query.tag_id }, docs => {
            res.status(200).json(docs);
        });
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Tag(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findById(req.params.id, tag => {
            res.status(200).json([tag]);
        });
    }

    public readRef(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findById(req.query.doc_id + '-tags', tag_ref => {
            res.status(200).json([tag_ref]);
        });
    }

    public indexRef(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view('tag', 'indexRef', {}, tag_refs => {
            res.status(200).json(tag_refs);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res);

        // db.find(
        //     {
        //         tag_id: req.params.id,
        //         type: 'tag_ref'
        //     },
        //     {},
        //     docs => {
        //         docs.forEach(doc => {
        //             db.delete(doc._id, noop);
        //         });
        //     }
        // );

        db.delete(req.params.id);
    }
}

export default TagsController;

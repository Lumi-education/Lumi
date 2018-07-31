import * as express from 'express';
import {assign, noop} from 'lodash';
import {IRequest} from '../../middleware/auth';

import db from '../../db';
import {ITag} from 'lib/tags/types';

import Controller from '../controller';

class TagsController extends Controller<{}> {
    constructor() {
        super('tag');
    }

    public action(req: IRequest, res: express.Response) {
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
                            db.insert(_tag_ref, (error, doc) => {
                                res.status(200).json(doc);
                            });
                        } else {
                            tag_ref.tags.push(req.params.id);
                            db.save(tag_ref, (error, saved_doc) => {
                                res.status(200).json(saved_doc);
                            });
                        }
                    }
                );
                break;
            case 'REM_FROM_DOC':
                db.findById(
                    req.body.payload.doc_id + '-tags',
                    (error, tag_ref) => {
                        tag_ref.tags = tag_ref.tags.filter(
                            tag_id => tag_id !== req.params.id
                        );
                        db.save(tag_ref, (err, saved_doc) => {
                            res.status(200).json(saved_doc);
                        });
                    }
                );
                break;
            default:
                break;
        }
    }

    public index(req: IRequest, res: express.Response) {
        db.view('tag', 'index', {key: req.query.tag_id}, (error, docs) => {
            res.status(200).json(docs);
        });
    }

    public create(req: IRequest, res: express.Response) {
        const new_tag: ITag = {
            _id: undefined,
            type: 'tag',
            name: 'no name',
            short_name: 'nn',
            description: '',
            color: 'red',
            created_at: new Date()
        };

        assign(new_tag, req.body);

        db.insert(new_tag, (error, tag) => {
            res.status(200).json(tag);
        });
    }

    public read(req: IRequest, res: express.Response) {
        db.findById(req.params.id, (error, tag) => {
            res.status(200).json([tag]);
        });
    }

    public readRef(req: IRequest, res: express.Response) {
        db.findById(req.query.doc_id + '-tags', (error, tag_ref) => {
            res.status(200).json([tag_ref]);
        });
    }

    public indexRef(req: IRequest, res: express.Response) {
        db.view('tag', 'indexRef', {}, (error, tag_refs) => {
            res.status(200).json(tag_refs);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        db.delete(req.params.id, err => {
            res.status(200).end();
        });
    }
}

export default TagsController;

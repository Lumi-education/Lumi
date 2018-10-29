import * as express from 'express';
import { assign, uniq } from 'lodash';
import { IRequest } from '../../middleware/auth';
import db from '../../db';

import { ITag } from 'lib/tags/types';

class TagsController {
    public add_tags_to_docs(req: IRequest, res: express.Response) {
        const tag_ids = req.body.tag_ids;
        const doc_ids = req.body.doc_ids;

        db.find(
            { _id: { $in: doc_ids } },
            { limit: doc_ids.length },
            (find_tags_error, docs) => {
                docs.forEach(doc => {
                    if (!doc.tags) {
                        doc.tags = [];
                    }
                    doc.tags = uniq([...doc.tags, ...tag_ids]);
                });
                db.updateMany(docs, {}, (update_error, updated_docs) => {
                    res.status(200).json(docs);
                });
            }
        );
    }

    public index(req: IRequest, res: express.Response) {
        db.view('tags', 'index', { key: req.query.tag_id }, (error, docs) => {
            if (error) {
                return res.status(400).json(error);
            }
            res.status(200).json(docs);
        });
    }

    public create(req: IRequest, res: express.Response) {
        const new_tag: ITag = {
            _id: undefined,
            type: 'tag',
            name: 'no name',
            short_name: undefined,
            description: '',
            color: 'lightgrey',
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

    public update(req: IRequest, res: express.Response) {
        const tag_id = req.params.id;

        db.findById(tag_id, (find_tag_error, tag) => {
            assign(tag, req.body.update);

            db.updateOne(tag_id, tag, (update_tag_error, tag_response) => {
                res.status(200).json(tag);
            });
        });
    }

    public delete(req: IRequest, res: express.Response) {
        db.find(
            { tags: { $in: [req.params.id] } },
            { limit: 1000 },
            (error, docs) => {
                docs.forEach(
                    doc =>
                        (doc.tags = doc.tags.filter(
                            tag_id => tag_id !== req.params.id
                        ))
                );

                db.updateMany(docs, {}, (update_docs_error, response) => {
                    db.delete(req.params.id, err => {
                        if (err) {
                            return res.status(err.status).json(err);
                        }
                        res.status(200).json(docs);
                    });
                });
            }
        );
    }
}

export default TagsController;

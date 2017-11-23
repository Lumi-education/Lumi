import * as express from 'express';
import { noop } from 'lodash';
import { IRequest } from '../../middleware/auth';

import Card from '../../models/Card';
import Tag from '../../models/Tag';
import { DB } from '../../db';

import Controller from '../controller';

class TagsController extends Controller<Tag> {
    public action(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findById(
            req.params.id,
            (tag: Tag) => {
                switch (req.body.type) {
                    case 'ADD_TO_DOC':
                        db.findById(req.body.payload.doc_id, doc => {
                            if (!doc.tags) {
                                doc.tags = [];
                            }
                            doc.tags.push(req.params.id);
                            db.save(doc);
                        });
                        break;
                    case 'REM_FROM_DOC':
                        db.findById(req.body.payload.doc_id, doc => {
                            doc.tags = doc.tags.filter(
                                tag_id => tag_id !== req.params.id
                            );
                            db.save(doc);
                        });
                        break;
                    default:
                        break;
                }
            },
            Tag
        );
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Tag(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);
        db.findById(req.params.id, (tag: Tag) => {
            db.find({ tags: { $in: [req.params.id] } }, {}, docs => {
                res.status(200).json({ docs, tags: [tag] });
            });
        });
    }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.find(
            {
                tags: { $in: [req.params.id] }
            },
            { limit: 1000 },
            docs => {
                docs.forEach(doc => {
                    doc.tags = doc.tags.filter(
                        tag_id => tag_id !== req.params.id
                    );
                    db.save(doc, noop);
                });
            },
            Card
        );

        db.delete(req.params.id);
    }
}

export default new TagsController('tag');

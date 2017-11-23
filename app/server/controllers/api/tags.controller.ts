import * as express from 'express';
import { assign, noop } from 'lodash';
import { IRequest } from '../../middleware/auth';

import Card from '../../models/Card';
import { ITag, ITagRef } from 'common/types';
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
            },
            Tag
        );
    }

    public list(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.find(
            assign({ $or: [{ type: 'tag' }, { type: 'tag_ref' }] }, req.query),
            {},
            docs => {
                const tag_refs = docs.filter(doc => doc.type === 'tag_ref');
                const tag_ids = tag_refs.map(ref => ref.tag_id);

                db.find({ _id: { $in: tag_ids } }, {}, (tags: ITag[]) => {
                    res.status(200).json({
                        tag_refs,
                        tags: [
                            ...tags,
                            ...docs.filter(doc => doc.type === 'tag')
                        ]
                    });
                });
            }
        );
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Tag(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);
        db.findById(req.params.id, (tag: Tag) => {
            db.find({ tag_id: req.params.id }, {}, tag_refs => {
                const doc_ids = tag_refs.map(ref => ref.doc_id);
                db.find({ _id: { $in: doc_ids } }, {}, docs => {
                    res.status(200).json({ docs, tags: [tag] });
                });
            });
        });
    }

    // public readRef(req: IRequest, res: express.Response) {
    //     const db = new DB(res);
    //     db.find(
    //         { doc_id: req.params.id, type: 'tag_ref' },
    //         {},
    //         (tag_refs: ITagRef[]) => {
    //             const tag_ids = tag_refs.map(ref => ref.tag_id);
    //             db.find({ _id: { $in: tag_ids } }, {}, (tags: Tag[]) => {
    //                 res.status(200).json({ tags, tag_refs });
    //             });
    //         }
    //     );
    // }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res);

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

export default new TagsController('tag');

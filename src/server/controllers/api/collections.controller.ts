import * as express from 'express';
import { IRequest } from '../../middleware/auth';

import Collection from '../../models/Collection';
import Card from '../../models/Card';
import Tag from '../../models/Tag';

import Controller from '../controller';
import { DB } from '../../db';

class CollectionController extends Controller<Collection> {
    constructor() {
        const _view = {
            _id: '_design/collection',
            views: {
                with_cards: {
                    map:
                        "function (doc) {\n  if (doc.type == 'collection') {\n    emit(doc._id, 1);\n    for (var i in doc.cards) {\n      emit(doc._id, { _id: doc.cards[i] });\n    }\n  }\n  \n}"
                },
                by_group: {
                    map:
                        "function (doc) {\n  if (doc.type === 'group') {\n    doc.assigned_collections.forEach(function(collection_id) {\n      emit(doc._id, { _id: collection_id });\n    })\n  }\n}"
                },
                for_user: {
                    map:
                        "function (doc) {\n  if (doc.data_type === 'collection') { \n    emit(doc.user_id, 1); \n    emit(doc.user_id, {_id: doc.collection_id});\n  }\n}"
                },
                list: {
                    map:
                        "function (doc) {\n  if (doc.type === 'collection') { emit(doc._id, 1); }\n}"
                }
            },
            language: 'javascript'
        };

        super('collection', _view);
    }

    public action(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        switch (req.body.type) {
            case 'ADD_CARDS':
                db.findById(
                    req.params.id,
                    (collection: Collection) => {
                        collection.add_cards(req.body.payload.card_ids);
                        db.save(collection);
                    },
                    Collection
                );
                break;

            case 'REM_CARDS':
                db.findById(
                    req.params.id,
                    (collection: Collection) => {
                        collection.rem_cards(req.body.payload.card_ids);
                        db.save(collection);
                    },
                    Collection
                );
                break;
            default:
                break;
        }
    }

    public list(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.view(
            'collection',
            'list',
            req.query._ids ? { keys: JSON.parse(req.query._ids) } : {},
            collections => res.status(200).json(collections)
        );
    }

    public for_user(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.view('collection', 'for_user', { key: req.user._id }, docs => {
            res.status(200).json(docs.filter(d => d)); // issue90 hack
        });
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.insert(new Collection(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.view('collection', 'with_cards', { key: req.params.id }, docs => {
            res.status(200).json(docs);
        });
    }

    public open_collection(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.view('collection', 'open', {}, docs => {
            res.status(200).json(docs);
        });
    }
}

export default new CollectionController();

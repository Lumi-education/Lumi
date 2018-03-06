import * as express from 'express';
import { IRequest } from '../../middleware/auth';

import Collection from '../../models/Collection';
import Card from '../../models/Card';
import Tag from '../../models/Tag';

import Controller from '../controller';
import { DB } from '../../db';

class CollectionController extends Controller<Collection> {
    constructor() {
        super('collection');
    }

    public action(req: IRequest, res: express.Response) {
        const db = new DB(res);

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
        const db = new DB(res);

        db.view(
            'collection',
            'list',
            req.query._ids ? { keys: JSON.parse(req.query._ids) } : {},
            collections => res.status(200).json(collections)
        );
    }

    public for_user(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view('collection', 'for_user', { key: req.user._id }, docs => {
            res.status(200).json(docs.filter(d => d)); // issue90 hack
        });
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Collection(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view('collection', 'with_cards', { key: req.params.id }, docs => {
            res.status(200).json(docs);
        });
    }

    public open_collection(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view('collection', 'open', {}, docs => {
            res.status(200).json(docs);
        });
    }
}

export default CollectionController;

import * as express from 'express';
import { Request } from '../../middleware/auth';

import Collection from '../../models/Collection';
import Card from '../../models/Card';
import Tag from '../../models/Tag';

import Controller from '../controller';
import { DB } from '../../db';

class CollectionController extends Controller<Collection> {
    public list(req: Request, res: express.Response) {
        const db = new DB(res);

        db.find(
            { type: 'collection' },
            req.query,
            (collections: Array<Collection>) => {
                res.status(200).json({ collections: collections });
            }
        );
    }

    public create(req: Request, res: express.Response) {
        const db = new DB(res);

        db.insert(new Collection(req.body));
    }

    public read(req: Request, res: express.Response) {
        const db = new DB(res);
        db.findById(
            req.params.id,
            (collection: Collection) => {
                collection.get_cards(db, (cards: Array<Card>) => {
                    res.status(200).json({
                        collections: [collection],
                        cards: cards
                    });
                });
            },
            Collection
        );
    }

    public cards(req: Request, res: express.Response) {
        const db = new DB(res);

        db.findById(
            req.params.id,
            (collection: Collection) => {
                collection.get_cards(db, (cards: Array<Card>) => {
                    res.status(200).json(cards);
                });
            },
            Collection
        );
    }

    public tags(req: Request, res: express.Response) {
        const db = new DB(res);

        db.findById(
            req.params.id,
            (collection: Collection) => {
                collection.get_tags(db, (tags: Array<Tag>) => {
                    res.status(200).json(tags);
                });
            },
            Collection
        );
    }
}

export default new CollectionController('collection');

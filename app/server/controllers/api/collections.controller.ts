import * as express from 'express';
import { IRequest } from '../../middleware/auth';

import Collection from '../../models/Collection';
import Card from '../../models/Card';
import Tag from '../../models/Tag';

import Controller from '../controller';
import { DB } from '../../db';

class CollectionController extends Controller<Collection> {
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

        db.find(
            { type: 'collection' },
            req.query,
            (collections: Collection[]) => {
                res.status(200).json({ collections });
            }
        );
    }

    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Collection(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);
        db.findById(
            req.params.id,
            (collection: Collection) => {
                collection.get_cards(db, (cards: Card[]) => {
                    res.status(200).json({
                        cards,
                        collections: [collection]
                    });
                });
            },
            Collection
        );
    }

    public cards(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findById(
            req.params.id,
            (collection: Collection) => {
                collection.get_cards(db, (cards: Card[]) => {
                    res.status(200).json(cards);
                });
            },
            Collection
        );
    }
}

export default new CollectionController('collection');

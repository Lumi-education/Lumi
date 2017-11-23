import * as express from 'express';
import { IRequest } from '../../middleware/auth';

import proxy from '../../core/proxy';
import Card from '../../models/Card';
import Tag from '../../models/Tag';
import { DB } from '../../db';

import Controller from '../controller';

class CardController extends Controller<Card> {
    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Card(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findById(req.params.id, (card: Card) => {
            res.status(200).json({
                cards: [card]
            });
        });
    }

    public action(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findById(
            req.params.id,
            (card: Card) => {
                switch (req.body.type) {
                    default:
                        break;
                }
            },
            Card
        );
    }

    public attachment(req: express.Request, res: express.Response) {
        req.url =
            '/' +
            process.env.DB +
            '/' +
            req.params.id +
            '/' +
            req.params.attachment;

        proxy.web(req, res, {
            target: process.env.DB_HOST
        });
    }
}

export default new CardController('card');

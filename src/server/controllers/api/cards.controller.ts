import * as express from 'express';
import { IRequest } from '../../middleware/auth';

import proxy from '../../core/proxy';
import Card from '../../models/Card';
import Tag from '../../models/Tag';
import { DB } from '../../db';

import Controller from '../controller';

class CardController extends Controller<Card> {
    constructor() {
        const _view = {
            _id: '_design/card',
            views: {
                list: {
                    map:
                        "function (doc) {\n  if (doc.type === 'card') { emit(doc._id, 1); }\n}"
                }
            },
            language: 'javascript'
        };

        super('card', _view);
    }
    public create(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Card(req.body));
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.findById(req.params.id, (card: Card) => {
            res.status(200).json([card]);
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

    public list(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.view(
            'card',
            'list',
            req.query._ids ? { keys: JSON.parse(req.query._ids) } : {},
            cards => res.status(200).json(cards)
        );
    }

    public attachment(req: express.Request, res: express.Response) {
        req.url =
            process.env.DB_HOST +
            '/' +
            process.env.DB +
            '/' +
            req.params.id +
            '/' +
            req.params.attachment +
            (req.query.rev ? '?rev=' + req.query.rev : '');

        proxy.web(req, res, {
            target: process.env.DB_HOST
        });
    }
}

export default CardController;

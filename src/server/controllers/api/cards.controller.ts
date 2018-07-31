import * as express from 'express';
import {IRequest} from '../../middleware/auth';

import proxy from '../../core/proxy';

import db from '../../db';
import Controller from '../controller';

import {ICard} from 'lib/cards/types';

class CardController extends Controller<ICard> {
    constructor() {
        super('card');
    }
    public create(req: IRequest, res: express.Response) {
        const new_card: ICard = req.body;
        db.insert(new_card);
    }

    public read(req: IRequest, res: express.Response) {
        db.findById(req.params.id, (error, card: ICard) => {
            res.status(200).json([card]);
        });
    }

    public list(req: IRequest, res: express.Response) {
        db.view(
            'card',
            'list',
            req.query._ids ? {keys: JSON.parse(req.query._ids)} : {},
            (error, cards) => res.status(200).json(cards)
        );
    }

    public h5p_proxy(req: express.Request, res: express.Response) {
        req.url = req.url.replace('/h5p', '');
        proxy.web(req, res, {
            target: 'http://localhost:3001'
        });
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

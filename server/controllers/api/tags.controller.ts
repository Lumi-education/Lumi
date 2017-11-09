import * as express from 'express';
import { noop } from 'lodash';
import { Request } from '../../middleware/auth';

import Tag from '../../models/Tag';
import Card from '../../models/Card';
import { DB } from '../../db';

import Controller from '../controller';

class TagsController extends Controller<Tag> {
    public create(req: Request, res: express.Response) {
        const db = new DB(res);

        db.insert(new Tag(req.body));
    }

    public delete(req: Request, res: express.Response) {
        const db = new DB(res);

        db.find(
            {
                tags: { $in: [req.params.id] },
                type: 'card'
            },
            { limit: 1000 },
            (cards: Array<Card>) => {
                cards.forEach(card => {
                    card.rem_tag(req.params.id);
                    db.save(card, noop);
                });
            },
            Card
        );

        db.delete(req.params.id);
    }
}

export default new TagsController('tag');

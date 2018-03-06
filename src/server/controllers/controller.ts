import * as express from 'express';
import { isEqual } from 'lodash';
import { IRequest } from '../middleware/auth';
import * as debug from 'debug';
import { DB } from '../db';

const log = debug('lumi:controller');

export default class Controller<T> {
    private type: string;

    constructor(type: string) {
        this.type = type;

        this.list = this.list.bind(this);
        this.read = this.read.bind(this);
    }

    public list(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.find({ type: this.type }, req.query, (docs: T[]) => {
            res.status(200).json(docs);
        });
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);
        db.findById(req.params.id, (doc: T) => {
            res.status(200).json([doc]);
        });
    }

    public update(req: IRequest, res: express.Response) {
        const db = new DB(res);

        const id = req.params.id === 'myself' ? req.user._id : req.params.id;

        db.update_one(id, req.body, (doc: T) => {
            res.status(200).json(doc);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.delete(req.params.id);
    }
}

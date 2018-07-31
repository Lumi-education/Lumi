import * as express from 'express';
import {IRequest} from '../middleware/auth';
import * as debug from 'debug';
import db from '../db';

const log = debug('lumi:controller');

export default class Controller<T> {
    private type: string;

    constructor(type: string) {
        this.type = type;

        this.list = this.list.bind(this);
        this.read = this.read.bind(this);
    }

    public list(req: IRequest, res: express.Response) {
        db.find({type: this.type}, req.query, (error, docs: T[]) => {
            res.status(200).json(docs);
        });
    }

    public read(req: IRequest, res: express.Response) {
        db.findById(req.params.id, (error, doc: T) => {
            res.status(200).json([doc]);
        });
    }

    public update(req: IRequest, res: express.Response) {
        const id = req.params.id === 'myself' ? req.user._id : req.params.id;

        db.updateOne(id, req.body, (error, doc: T) => {
            res.status(200).json(doc);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        db.delete(req.params.id);

        res.status(200).end();
    }
}

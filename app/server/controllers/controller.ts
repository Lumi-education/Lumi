import * as express from 'express';
import { isEqual } from 'lodash';
import { IRequest } from '../middleware/auth';
import * as debug from 'debug';
import { DB } from '../db';

const log = debug('lumi:controller');

export default class Controller<T> {
    private type: string;

    constructor(type: string, _view?) {
        this.type = type;

        const db = new DB(null);

        if (_view) {
            db.checkView('_design/' + type, view => {
                if (!view) {
                    log(this.type + '-view not found -> creating view');
                    db.insert(_view, () => {
                        log(this.type + '-view created');
                    });
                }
                if (view) {
                    if (isEqual(view.views, _view.views)) {
                        log(this.type + '-view is up to date');
                    } else {
                        log(this.type + '-view is not up to date -> updating');
                        db.update_one('_design/' + this.type, _view, doc => {
                            log(this.type + '-view updated');
                        });
                    }
                }
            });
        }

        this.list = this.list.bind(this);
        this.read = this.read.bind(this);
    }

    public list(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.find({ type: this.type }, req.query, (docs: T[]) => {
            const o = {};
            o[this.type + 's'] = docs;
            res.status(200).json(o);
        });
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res);
        db.findById(req.params.id, (doc: T) => {
            const o = {};
            o[this.type + 's'] = [doc];
            res.status(200).json(o);
        });
    }

    public update(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.update_one(req.params.id, req.body, (doc: T) => {
            res.status(200).json(doc);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.delete(req.params.id);
    }
}

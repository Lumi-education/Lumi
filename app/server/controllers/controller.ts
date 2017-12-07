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

        new DB(null, null).dbList(dbs => {
            dbs.forEach(db => {
                if (db.charAt(0) === '_') {
                    return;
                }
                if (_view) {
                    const _db = new DB(null, db);
                    _db.checkView('_design/' + type, view => {
                        if (!view) {
                            log(this.type + '-view not found -> creating view');
                            _db.insert(_view, () => {
                                log(this.type + '-view created');
                            });
                        }
                        if (view) {
                            if (isEqual(view.views, _view.views)) {
                                log(this.type + '-view is up to date');
                            } else {
                                log(
                                    this.type +
                                        '-view is not up to date -> updating'
                                );
                                _db.update_one(
                                    '_design/' + this.type,
                                    _view,
                                    doc => {
                                        log(this.type + '-view updated');
                                    }
                                );
                            }
                        }
                    });
                }
            });
        });

        this.list = this.list.bind(this);
        this.read = this.read.bind(this);
    }

    public list(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.find({ type: this.type }, req.query, (docs: T[]) => {
            res.status(200).json(docs);
        });
    }

    public read(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);
        db.findById(req.params.id, (doc: T) => {
            res.status(200).json([doc]);
        });
    }

    public update(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.update_one(req.params.id, req.body, (doc: T) => {
            res.status(200).json(doc);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        const db = new DB(res, req.params.db);

        db.delete(req.params.id);
    }
}

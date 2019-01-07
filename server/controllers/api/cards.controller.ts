import * as express from 'express';
import { IRequest } from '../../middleware/auth';
import { assign } from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'copy-dir';
import * as rimraf from 'rimraf';
import * as mkdirp from 'mkdirp';
import * as unzip from 'unzip';
import * as recursive from 'recursive-readdir';
import * as raven from 'raven';

import db from '../../db';

import { ICard } from 'lib/cards/types';

class CardController {
    public create(req: IRequest, res: express.Response) {
        const new_card: ICard = {
            card_type: 'text',
            _id: undefined,
            type: 'card',
            name: 'no name',
            text: 'missing text',
            description: '',
            created_at: new Date(),
            tags: [],
            _rev: undefined,
            _deleted: false,
            _attachments: {}
        };

        assign(new_card, req.body);

        db.insert(new_card, (create_card_error, created_card) => {
            if (create_card_error) {
                raven.captureException(create_card_error);
                return res.status(400).json(create_card_error);
            }
            try {
                mkdirp(
                    path.resolve('build/files') + '/' + created_card._id,
                    mkdirp_error => {
                        if (mkdirp_error) {
                            raven.captureException(mkdirp_error);
                            return res.status(400).json(mkdirp_error);
                        }
                        return res.status(200).json(created_card);
                    }
                );
            } catch (err) {
                raven.captureException(err);
                res.status(400).json(err);
            }
        });
    }

    public duplicate(req: IRequest, res: express.Response) {
        try {
            const card_id = req.params.id;

            if (!card_id) {
                return res.status(400).json({ message: 'no card_id' });
            }

            db.findById(card_id, (find_card_error, card) => {
                if (find_card_error) {
                    return res.status(404).json({ message: 'card not found' });
                }

                card._id = undefined;

                db.insert(card, (insert_card_error, new_card) => {
                    if (insert_card_error) {
                        raven.captureException(insert_card_error);
                        return res.status(400).json(insert_card_error);
                    }

                    mkdirp(
                        path.resolve('build/files') +
                            '/' +
                            new_card._id +
                            '/files',
                        mkdirp_error => {
                            if (mkdirp_error) {
                                raven.captureException(mkdirp_error);
                                return res.status(400).json(mkdirp_error);
                            }

                            try {
                                cp.sync(
                                    path.resolve('build/files') + '/' + card_id,
                                    path.resolve('build/files') +
                                        '/' +
                                        new_card._id
                                );
                            } catch (err) {
                                raven.captureException(err);
                                return res.status(200).json(new_card);
                            }

                            return res.status(200).json(new_card);
                        }
                    );
                });
            });
        } catch (err) {
            raven.captureException(err);
            res.status(400).json(err);
        }
    }

    public read(req: IRequest, res: express.Response) {
        db.findById(req.params.id, (error, card: ICard) => {
            recursive(
                path.resolve('build/files') + '/' + req.params.id,
                (err, _files) => {
                    if (err) {
                        return res.status(200).json([card]);
                    }
                    res.status(200).json([
                        assign(card, {
                            files: _files.map(_file => path.basename(_file))
                        })
                    ]);
                }
            );
        });
    }

    public update(req: IRequest, res: express.Response) {
        db.updateOne(req.params.id, req.body, (err, updated_doc) => {
            if (err) {
                return res.status(err.status).json(err);
            }
            res.status(200).json(updated_doc);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        db.delete(req.params.id, err => {
            rimraf(
                path.resolve('build/files') + '/' + req.params.id,
                {},
                error => {
                    if (error) {
                        return res.status(400).json(err);
                    }
                    return res.status(200).end();
                }
            );
        });
    }

    public list(req: IRequest, res: express.Response) {
        // const query = req.query._ids
        //     ? { type: 'card', _id: { $in: JSON.parse(req.query._ids) } }
        //     : { type: 'card' };

        // db.find(query, { limit: 200 }, (find_cards_error, cards) => {
        //     if (find_cards_error) {
        //         res.status(find_cards_error.status).json(find_cards_error);
        //     }
        //     res.status(200).json(cards);
        // });
        db.view(
            'cards',
            'index',
            req.query._ids ? { keys: JSON.parse(req.query._ids) } : {},
            (error, cards) => {
                if (error) {
                    return res.status(400).json(error);
                }
                res.status(200).json(cards);
            }
        );
    }
}

export default CardController;

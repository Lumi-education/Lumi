import * as express from 'express';
import { IRequest } from '../../middleware/auth';
import { assign } from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import * as unzip from 'unzip';
import proxy from '../../core/proxy';

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
            _attachments: {},
            _rev: undefined
        };

        assign(new_card, req.body);

        db.insert(new_card, (create_card_error, created_card) => {
            res.status(200).json([created_card]);
        });
    }

    public read(req: IRequest, res: express.Response) {
        db.findById(req.params.id, (error, card: ICard) => {
            res.status(200).json([card]);
        });
    }

    public update(req: IRequest, res: express.Response) {
        db.updateOne(req.params.id, req.body, (err, updated_doc) => {
            res.status(200).json(updated_doc);
        });
    }

    public delete(req: IRequest, res: express.Response) {
        db.delete(req.params.id, err => {
            res.status(200).end();
        });
    }

    public list(req: IRequest, res: express.Response) {
        db.view(
            'card',
            'list',
            req.query._ids ? { keys: JSON.parse(req.query._ids) } : {},
            (error, cards) => res.status(200).json(cards)
        );
    }

    public h5p_proxy(req: express.Request, res: express.Response) {
        req.url = req.url.replace('/h5p', '');
        proxy.web(req, res, {
            target: 'http://localhost:3001'
        });
    }

    public h5p_upload(req: any, res: express.Response) {
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const uploaded_file = req.files.file;

        // Use the mv() method to place the file somewhere on your server
        uploaded_file.mv(
            path.resolve('build/tmp') + '/' + uploaded_file.name,
            err => {
                if (err) {
                    return res.status(500).send(err);
                }

                fs.createReadStream(
                    path.resolve('build/tmp') + '/' + uploaded_file.name
                ).pipe(
                    unzip
                        .Extract({
                            path: 'h5p/' + uploaded_file.name
                        })
                        .on('finish', error => {
                            res.send('File uploaded!');
                        })
                );
            }
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

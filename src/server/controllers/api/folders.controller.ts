import * as express from 'express';
import * as raven from 'raven';

import { assign } from 'lodash';
import { IRequest } from '../../middleware/auth';

import db from '../../db';

export default class FoldersController {
    public create(req: IRequest, res: express.Response) {
        const folder = req.body.folder;
        assign(folder, {
            type: 'folder'
        });
        db.insert(folder, (insert_folder_error, created_folder) => {
            if (insert_folder_error) {
                raven.captureException(insert_folder_error);
                return res.status(400).json(insert_folder_error);
            }

            db.findById(
                req.body.in_folder,
                (find_folder_error, parent_folder) => {
                    parent_folder.content = [
                        ...parent_folder.content,
                        { _id: created_folder._id, type: 'folder' }
                    ];
                    db.updateOne(
                        req.body.in_folder,
                        parent_folder,
                        (update_folder_error, updated_folder) => {
                            res.status(200).json([
                                updated_folder,
                                created_folder
                            ]);
                        }
                    );
                }
            );
        });
    }

    public all(req: IRequest, res: express.Response) {
        db.view('folders', 'all', {}, (folders_view_error, folders) => {
            if (folders_view_error) {
                return res.status(400).json(folders_view_error);
            }

            res.status(200).json(folders);
        });
    }

    public add_material(req: IRequest, res: express.Response) {
        const folder_id = req.params.folder_id;
        const _ids = req.body._ids;

        db.findById(folder_id, (find_folder_error, folder) => {
            folder.content = [
                ...folder.content,
                ..._ids.map(_id => {
                    return { _id, type: 'card' };
                })
            ];

            db.updateOne(
                folder_id,
                folder,
                (update_folder_error, updated_folder) => {
                    res.status(200).json([folder]);
                }
            );
        });
    }
}

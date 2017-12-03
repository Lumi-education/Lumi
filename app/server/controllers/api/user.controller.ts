import * as express from 'express';
import { assign } from 'lodash';
import { DB } from '../../db';
import { IRequest } from '../../middleware/auth';

import User from '../../models/User';
import Group from '../../models/Group';
import Collection from '../../models/Collection';
import Data from '../../models/Data';

export class UserController {
    public createData(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.insert(new Data(assign({}, { user_id: req.user._id }, req.body)));
    }

    public updateData(req: IRequest, res: express.Response) {
        const db = new DB(res);

        db.update_one(req.params.id, req.body, (data: Data) => {
            res.status(200).json(data);
        });
    }

    public collections(req: IRequest, res: express.Response) {
        const db = new DB(res);
        db.findOne(
            { _id: req.user._id },
            {},
            (user: User) => {
                user.get_groups(db, (groups: Group[]) => {
                    const groupsIds = groups
                        .map(group => group.active_collections || [])
                        .reduce((p, a) => [...p, ...a], []);
                    db.find(
                        {
                            _id: { $in: groupsIds },
                            type: 'collection'
                        },
                        {},
                        (collections: Collection[]) => {
                            res.status(200).json(collections);
                        }
                    );
                });
            },
            User
        );
    }
}

export default new UserController();

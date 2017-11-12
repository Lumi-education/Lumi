import * as express 	from 'express';

import { DB }				from '../../../db';
import { Request } 		from '../../../middleware/auth';

import User 			from '../../../models/User';
import Group 			from '../../../models/Group';
import Collection 		from '../../../models/Collection';

export class UserController {
	public collections(req: Request, res: express.Response) {
		const db = new DB(res);
		db.findOne(
			{ _id: req.user._id },
			{},
			(user: User) => {
				user.get_groups(db, (groups: Array<Group>) => {
					const groups_ids = groups.map(group => group.assigned_collections).reduce((p, a) => [...p, ...a], []);

					db.find(
						{
							_id: { $in: groups_ids },
							type: 'collection'
						},
						{},
						(collections: Array<Collection>) => {

							res.status(200).json({
								collections: collections
							});

						}
					);
					
				});
			},
			User
		);
	}
}

export default new UserController();
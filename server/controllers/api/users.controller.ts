import * as express 	from 'express';
import { Request } 		from '../../middleware/auth';

import User 			from '../../models/User';
import Group 			from '../../models/Group';
import { DB } 			from '../../db';

import Controller 		from '../controller';

class UserController extends Controller<User> {

	public list(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.find(
			{ type: 'user' },
			req.query, 
			(users: Array<User>) => { 
				const group_ids = users.map(u => u.groups).reduce((p, c) => p.concat(c), []);
				db.find(
					{
						type: 'group',
						_id: { $in: group_ids }
					},
					{},
					(groups: Array<Group>) => {
						res.status(200).json({
							users: users,
							groups: groups
						});
					}
				);
			}
		);
	}

	public create(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.insert( new User(req.body) );
			
	}
}

export default new UserController('user');
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

	public read(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.findById(
			req.params.id, 
			(user: User) => { 
				user.get_groups(db, (groups: Array<Group>) => {
					res.status(200).json({
						user,
						groups
					});
				});
			},
			User
		);
	}

	public create(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.insert( new User(req.body) );
			
	}

	public action(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.findById(
			req.params.id,
			(user: User) => {
				switch (req.body.type) {
					case 'ADD_GROUP':
						user.add_group( req.body.payload.group_id );
						db.save(user);						
						break;
					case 'REM_GROUP':
						user.rem_group( req.body.payload.group_id );
						db.save( user );
						break;
					default:
						break;
				}
			},
			User
		);
			
	}
}

export default new UserController('user');
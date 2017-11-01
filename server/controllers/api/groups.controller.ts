import * as express 	from 'express';
import { Request } 		from '../../middleware/auth';

import Group 		from '../../models/Group';
import User 		from '../../models/User';
import { DB } 				from '../../db';

import Controller 			from '../controller';

class GroupController extends Controller<Group> {

	public list(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.find(
			{ type: 'group' },
			req.query, 
			(groups: Array<Group>) => { 
				res.status(200).json({ groups: groups });
			}
		);
	}

	public create(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.insert( new Group(req.body) );
			
	}

	public read(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.findById(
			req.params.id, 
			(group: Group) => { 
				db.find(
					{
						groups: { $in: [ req.params.id ] }
					},
					{},
					(users: Array<User>) => {
						res.status(200).json({
							groups: [ group ],
							users: users
						});
					},
					User
				);
				
			}
		);
	}

	public for_user(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.findById(
			req.params.user_id, 
			(user: User) => {
				user.get_groups(db, (groups: Array<Group>) => {
					res.status(200).json( groups );
				});
			}, 
			User
		);
			
	}

	public delete(req: Request, res: express.Response) {
		
		const db = new DB(res);

		db.find(
			{
				groups: { $in: [req.params.id] },
				type: 'user'
			},
			{ limit: 1000 },
			(users: Array<User>) => {
				users.forEach(user => {
					user.rem_group( req.params.id );
					db.save( user , { do_not_respond: true });
				});
			},
			User
		);
		
		db.delete( req.params.id );

	}
}

export default new GroupController('group');
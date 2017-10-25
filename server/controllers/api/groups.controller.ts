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
}

export default new GroupController('group');
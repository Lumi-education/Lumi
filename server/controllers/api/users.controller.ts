import * as express 	from 'express';
import { Request } 		from '../../middleware/auth';

import User 		from '../../models/User';
import { DB } 				from '../../db';

import Controller 			from '../controller';

class UserController extends Controller<User> {
	public create(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.insert( new User(req.body) );
			
	}
}

export default new UserController('user');
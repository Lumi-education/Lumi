import * as express 	from 'express';
import { Request } 		from '../middleware/auth';

import Collection 		from '../models/Collection';
import { DB } 				from '../db';

export function get_test(req: Request, res: express.Response) {

	const db = new DB(res);

	db.find({ _id: 'test' }, (doc) => { res.status(200).json(doc); });
	
}
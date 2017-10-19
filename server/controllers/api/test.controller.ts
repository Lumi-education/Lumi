import * as express 	from 'express';
import { Request } 		from '../../middleware/auth';

import Collection 		from '../../models/Collection';
import { DB } 				from '../../db';

export function get_test(req: Request, res: express.Response) {

	// const db = new DB(res);

	// db.findById(
	// 	req.query._id, 
	// 	(collection: Collection) => { 
	// 		collection.get_cards(db, (docs) => {
	// 			res.status(200).json([ collection, ...docs ]); 
	// 		});
	// 	},
	// 	Collection
	// );

	res.status(200).end('ok');
	
}
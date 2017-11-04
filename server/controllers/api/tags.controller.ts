import * as express 	from 'express';
import { Request } 		from '../../middleware/auth';

import Tag 		from '../../models/Tag';
import { DB } 				from '../../db';

import Controller 			from '../controller';

class TagsController extends Controller<Tag> {
	public create(req: Request, res: express.Response) {
		
			const db = new DB(res);
		
			db.insert( new Tag(req.body) );
			
	}
}

export default new TagsController('tag');
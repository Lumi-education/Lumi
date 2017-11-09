import * as express 		from 'express';
import { assign } 			from 'lodash';
import { Request } 			from '../../../middleware/auth';

import Data 				from '../../../models/DAta';
import { DB } 				from '../../../db';

import Controller 			from '../../controller';

class DataController extends Controller<Data> {
	public create(req: Request, res: express.Response) {
		
			const db = new DB(res);
		
			db.insert( new Data( assign({}, { user_id: req.user._id }, req.body) ) );
			
	}
	
	public find(req: Request, res: express.Response) {
		
			const db = new DB(res);
		
			db.find(
				assign({}, { user_id: req.user._id }, req.query),
				{},
				(data: Array<Data>) => {
					res.status(200).json({ data: data });
				},
				Data
			);
			
	}
}

export default new DataController('data');
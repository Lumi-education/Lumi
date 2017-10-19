import * as express 	from 'express';
import { assign } 		from 'lodash';

import { Request } 		from '../../../middleware/auth';
import db 				from '../../../db';
import { DB } 			from '../../../db';

import CardData	from '../../../models/CardData';
import Controller 		from '../../controller';

class CardDataController extends Controller<CardData> {
	public list(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.find(
			{ 
				type: 'carddata',
				user_id: req.user._id
			},
			req.query, 
			(docs: Array<CardData>) => { 
				res.status(200).json( docs );
			}
		);
	}

	public create(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.insert( new CardData( req.body ) );
	
	}

}
import * as express 	from 'express';
import { Request } 		from '../../middleware/auth';

import Card 		from '../../models/Card';
import { DB } 				from '../../db';

import Controller 			from '../controller';

class CardController extends Controller<Card> {
	public create(req: Request, res: express.Response) {
		
			const db = new DB(res);
		
			db.insert( new Card(req.body) );
			
	}

	public action(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.findById(
			req.params.id,
			(card: Card) => {
				switch (req.body.type) {
					case 'ADD_TAG':
						card.add_tag( req.body.payload.tag_id );
						db.save( card );						
						break;
					case 'REM_TAG':
						card.rem_tag( req.body.payload.tag_id );
						db.save( card );						
						break;
					default:
						break;
				}
			},
			Card
		);
			
	}
}

export default new CardController('card');
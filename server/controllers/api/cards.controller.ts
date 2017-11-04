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
// export function get_card_list(req: Request, res: express.Response) {
	
// 	const db = new DB(res);
	
// 	db.find(
// 		{ type: 'card' },
// 		req.query, 
// 		(cards: Array<Card>) => { 
// 			res.status(200).json( cards );
// 		}
// 	);

// }

// export function create_card(req: Request, res: express.Response) {
	
// 	const db = new DB(res);
	
// 	db.insert( new Card(req.body) );
		
// }

// export function get_card_by_id(req: Request, res: express.Response) {
	
// 	const db = new DB(res);
	
// 	db.findById(
// 		req.params.card_id, 
// 		(card: Card) => { 
// 			res.status(200).json( card );
// 		}
// 	);
		
// }

// export function update_card(req: Request, res: express.Response) {
	
// 	const db = new DB(res);
	
// 	db.update_one(
// 		req.params.card_id,
// 		req.body,
// 		(card: Card) => { 
// 			res.status(200).json( card );
// 		}
// 	);
		
// }

// export function delete_card(req: Request, res: express.Response) {
	
// 	const db = new DB(res);
	
// 	db.delete( req.params.card_id );
		
// }
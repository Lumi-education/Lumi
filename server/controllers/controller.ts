import * as express 	from 'express';
import { Request } 		from '../middleware/auth';

import { DB } 				from '../db';

export default class Controller<T> {
	private type: string;

	constructor(type: string) { 
		this.type = type; 

		this.list = this.list.bind( this );
	}

	public list(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.find(
			{ type: this.type },
			req.query, 
			(docs: Array<T>) => { 
				res.status(200).json( docs );
			}
		);
	}

	public read(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.findById(
			req.params.id, 
			(doc: T) => { 
				res.status(200).json( doc );
			}
		);
	}

	public update(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.update_one(
			req.params.id,
			req.body,
			(doc: T) => { 
				res.status(200).json( doc );
			}
		);
			
	}

	public delete(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.delete( req.params.id );

	}
}
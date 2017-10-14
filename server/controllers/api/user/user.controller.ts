import * as express 	from 'express';

import db 				from '../../../db';
import { Request } 		from '../../../middleware/auth';

export function get_user(req: Request, res: express.Response) {
	
	db.view('user', 'init', { key: req.user._id, include_docs: true }, (err, body) => {
		res.status(200).json(body.rows.map(r => r.doc));
	});
				
}
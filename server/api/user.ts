import * as express 		from 'express';
import * as nano 			from 'nano';

import { 
	auth, 
	level,
	Request
} 		from '../core/auth';

export default function boot(server: express.Application, db: nano) {
	server.get(
		'/api/user', 
		auth, 
		level('student'), 
		(req: Request, res: express.Response) => {

			db.view('user', 'init', { key: req.user._id, include_docs: true }, (err, body) => {
				res.status(200).json(body.rows.map(r => r.doc));
			});
			
	});

}
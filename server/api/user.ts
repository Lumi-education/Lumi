import * as express 		from 'express';
import * as nano 			from 'nano';

import { auth, level } 		from '../core/auth';

export default function boot(server: express.Application, db: nano) {
	server.get('/api/user', auth, level('student'), (
		req: express.Request, 
		res: express.Response, 
		next: express.NextFunction
	) => {

		// get groups 
		db.view('user', 'init', { key: req.user._id, include_docs: true }, (err, body) => {
			res.status(200).json(body.rows.map(r => r.doc));
		});
	});

}
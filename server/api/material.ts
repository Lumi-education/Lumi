import * as express from 'express';
import * as nano from 'nano';

import {
	assign
} from 'lodash';

import { 
	auth,
	Request
} 	from '../core/auth';

import {
	create,
	update
} from '../db/crud';

export default function boot(server: express.Application, db: nano) {

	server.put(
		'/api/user/material/meta/:_id',
		auth,
		(req: express.Request, res: express.Response, next: express.NextFunction) => {
			db.get(req.params._id, (err, body) => {
				if (err) {
					res.status(500).json(err);
					return;
				}
				const updated_doc = assign({}, body, req.body);

				db.insert(updated_doc, (err, body) => {
					if (err) {
						res.status(500).json(err);
						return;
					}
					res.status(200).json(body);
				});
			});
		});

	server.post(
		'/api/user/material/meta',
		auth,
		(req: Request, res: express.Response, next: express.NextFunction) => {
			db.insert( assign({}, req.body, { user_id: req.user._id }), (err, body) => {
				if (err) {
					res.status(500).json(err);
					return;
				}
				res.status(200).json(body);
			});
		});
}
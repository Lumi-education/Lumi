import * as express 	from 'express';
import { assign } 		from 'lodash';

import { Request } 		from '../../../middleware/auth';
import db 				from '../../../db';

export function create_userdata(req: Request, res: express.Response) {
	db.insert( assign({}, req.body, { user_id: req.user._id }), (err, body) => {
		if (err) {
			res.status(500).json(err);
			return;
		}
		res.status(200).json(body);
	});
}

export function update_userdata(req: express.Request, res: express.Response) {
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
}
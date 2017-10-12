import * as express from 'express';
import * as nano 	from 'nano';
import { 
	auth,
	Request
} 	from '../core/auth';

import { assign } 	from 'lodash';

import { 
	create,
	update 
} 	from '../db/crud';

class CollectionMeta {
	private _id: string;
	private user_id: string;
	private collection_id: string;
	private submitted: boolean;
	private type: 'collection_meta';

	constructor(user_id: string, collection_id: string) {
		this.user_id = user_id;
		this.collection_id = collection_id;
		this.type = 'collection_meta';
		this.submitted = false;
	}

}

export default function boot(server: express.Application, db: nano) {

	server.post(
		'/api/user/v0/collectionmeta', 
		auth,
		(req: Request, res: express.Response, next: express.NextFunction) => {
			req.doc = new CollectionMeta(req.user._id, req.body.collection_id);
			next();
		},
		create()
	);
	
	server.put(
		'/api/user/v0/collectionmeta/:_id/submit', 
		update({ submitted: true })
	);

	server.put(
		'/api/user/collection/:_id/reset',
		update({ submitted: false })
	);

}
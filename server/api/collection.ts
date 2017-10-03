import * as express from 'express';
import * as nano 	from 'nano';
import { auth } 	from '../core/auth';

import { assign } 	from 'lodash';

import { 
	create,
	update 
} 	from '../db/crud';

class CollectionMeta {
	constructor(user_id: string, collection_id: string) {
		this.user_id = user_id;
		this.collection_id = collection_id;
		this.type = 'collection_meta';
		this.submitted = false;
	}
	private _id: string;
	user_id: string;
	collection_id: string;
	submitted: boolean;
	type: 'collection_meta';
}

export default function boot(server: express.Application, db: nano) {

	server.post('/api/v0/collectionmeta', 
	auth,
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
		req.doc = new CollectionMeta(req.user._id, req.body.collection_id);
		next();
	},
	create()
	);
	
	 server.put(
		'/api/v0/collectionmeta/:_id/submit', 
		update({ submitted: true })
	);

}
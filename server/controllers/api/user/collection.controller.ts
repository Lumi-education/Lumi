import * as express 	from 'express';
import { assign } 		from 'lodash';

import { Request } 		from '../../../middleware/auth';
import db 				from '../../../db';

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

export function get_collection(req: Request, res: express.Response) {

	// get groups 
	db.view('user', 'groups', { key: req.user._id, include_docs: true }, (err, body) => {
		const assignedCollectionIds = body.rows.map(r => r.doc)
	.map(d => d.assigned_collections).reduce((p, c) =>  p.concat(c), []);

		db.view('collection', 'with-material', {
				keys: assignedCollectionIds,
				include_docs: true
			},     (err, collectionWithMaterial) => {

				let b = assignedCollectionIds.map(a => [req.user._id, a]);
				db.view('user', 'meta', {
					keys: b,
					include_docs: true
				},      (err, collectionMaterialMeta) => {

					let c = collectionWithMaterial.rows.map(r => r.doc);
					let d = collectionMaterialMeta.rows.map(r => r.doc);

					let t = [].concat(c).concat(d);

					res.status(200).json(t);
				});

			});
		
	});
}

export function create_collection(req: Request, res: express.Response) {
	db.insert( new CollectionMeta(req.user._id, req.body.collection_id) , (err, body) => {
		if (err) { res.status(500).json(err); return; }
		db.get(body.id, (err, body) => {
			if (err) { res.status(500).json(err); return; }				
			res.status(201).json(body);
		});
	});
}

export function submit_collection(req: Request, res: express.Response) {
	db.get( req.params._id , (err, body) => {
		if (err) { res.status(500).json(err); return; }
		const updated_doc = assign({}, body, { submitted: true });

		db.insert(updated_doc, (err, body) => {
			if (err) { res.status(500).json(err); return; }				
			res.status(200).json(body);
		});

	});
}

export function reset_collection(req: Request, res: express.Response) {
	db.get( req.params._id , (err, body) => {
		if (err) { res.status(500).json(err); return; }
		const updated_doc = assign({}, body, { submitted: false });

		db.insert(updated_doc, (err, body) => {
			if (err) { res.status(500).json(err); return; }				
			res.status(200).json(body);
		});

	});
}
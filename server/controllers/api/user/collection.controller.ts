import * as express 	from 'express';
import { assign } 		from 'lodash';

import { Request } 		from '../../../middleware/auth';
import db 				from '../../../db';
import { DB } 			from '../../../db';

import CollectionData	from '../../../models/CollectionData';
import Collection 		from '../../../models/Collection';
import Controller 		from '../../controller';

class CollectionDataController extends Controller<CollectionData> {
	public list(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.find(
			{ 
				type: 'collectiondata',
				user_id: req.user._id
			},
			{}, 
			(collectiondata: Array<CollectionData>) => {
				const collection_ids = collectiondata.map(d => d.collection_id);

				db.find(
					{ _id: { $in: collection_ids }},
					{ limit: 1000 },
					(collections: Array<Collection>) => {
						res.status(200).json({
							collections: collections,
							collectiondata: collectiondata
						});
					}
				);
				
			}
		);
	}

	public list_for_user(req: Request, res: express.Response) {
		
		const db = new DB(res);
		
		db.find(
			{ 
				type: 'collectiondata',
				user_id: req.params.user_id
			},
			req.query, 
			(docs: Array<CollectionData>) => { 
				res.status(200).json( docs );
			}
		);
	}

	public create(req: Request, res: express.Response) {
		
			const db = new DB(res);
		
			db.insert( new CollectionData( assign({ user_id: req.user._id }, req.body) ) );
	
	}

}

export default new CollectionDataController('collectiondata');

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
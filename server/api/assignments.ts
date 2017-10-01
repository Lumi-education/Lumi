import * as express 		from 'express';
import * as nano 			from 'nano';

import { auth, level } 		from '../core/auth';

export default function boot(server: express.Application, db: nano) {
	server.get('/api/user/assignments', auth, level('guest'), (
		req: express.Request, 
		res: express.Response, 
		next: express.NextFunction
	) => {

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
 	});

}
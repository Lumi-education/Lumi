import { assign } 	   from 'lodash';
import * as express 	from 'express';
import * as nano 	   from 'nano';

const _nano = nano( process.env.DB_HOST );
const _db = _nano.db.use( process.env.DB );

export function create(): any {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		_db.insert( req.doc , (err, body) => {
			if (err) { res.status(500).json(err); return; }
			_db.get(body.id, (err, body) => {
				if (err) { res.status(500).json(err); return; }				
				res.status(201).json(body);
			});
		});
	};
}

export function read(): any {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		_db.get(req.params._id, (err, body) => {
			if (err) { res.status(500).json(err); return; }				
			res.status(200).json(body);
		});
	};
}

export function update(update: Object): any {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {

		_db.get( req.params._id , (err, body) => {
			if (err) { res.status(500).json(err); return; }
			const updated_doc = assign({}, body, update);
	
			_db.insert(updated_doc, (err, body) => {
				if (err) { res.status(500).json(err); return; }				
				res.status(200).json(body);
			});
	
		});
	}
}

export function destroy(): any {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		_db.get(req.params._id, (err, body) => {
			if (err) { res.status(500).json(err); return; }				
			
			_db.destroy(req.params._id, body._rev, (err, body) => {
				if (err) { res.status(500).json(err); return; }				
				res.status(200).end();
			});
			
		});
	};
}


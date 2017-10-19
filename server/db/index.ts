import * as nano from 'nano';
import * as request from 'superagent';
import { assign }	from 'lodash';
import * as express from 'express';

const db = process.env.DB_HOST + '/' + process.env.DB + '/' ;

const _nano = nano( process.env.DB_HOST || 'http://localhost:5984');

export default _nano.db.use( process.env.DB || 'lumidb');

export class DB {

	private res: express.Response;

	constructor(res: express.Response) {
		this.res = res;

		this.handle_error = this.handle_error.bind( this );
	}

	public findById(_id: string, cb: (doc) => void, type?)  {
		request.get( db + _id )
		.then(res => {
			cb( type ? new type( res.body ) : res.body );
		})
		.catch(this.handle_error);
	}

	public save(doc) {
		request
		.put( db + doc._id )
		.send( doc )
		.then(res => {
			this.res.status(200).json( assign({}, doc, { _id: res.body.id, _rev: res.body.rev } ));
		})
		.catch(this.handle_error);
	}

	public insert(doc) {
		request
		.post( db )
		.send( doc )
		.then(res => {
			this.res.status(200).json( assign({}, doc, { _id: res.body.id, _rev: res.body.rev } ));
		})
		.catch(this.handle_error);
	}

	public find(query, options, cb: (doc) => void, type?) {
		request.post( db + '_find' )
		.send( assign({ selector: query }, options ) )
		.then(res => {
			cb( type ? res.body.docs.map(d => new type(d) ) : res.body.docs );
		})
		.catch(this.handle_error);
	}

	public findOne(query, options, cb: (doc) => void, type?) {
		this.find(
			query, 
			options, 
			(docs) => {
				cb( docs[0] );
			}, 
			type
		);
	}

	public update_one(_id: string, update, cb: (doc) => void) {
		request.get( db + _id )
		.then(({ body }) => {
			const _update = assign({}, body, update);
			request
			.put( db + body._id )
			.send( _update )
			.then(res => cb( assign({}, _update, { _rev: res.body.rev } )))
			.catch(this.handle_error);
		})
		.catch(this.handle_error);
	}

	public delete(_id: string) {
		request.delete( db + _id )
		.then(() => {
			this.res.status(200).end();
		})
		.catch(this.handle_error);
	}

	private handle_error(err) {
		this.res.status(500).end('db error: ' + JSON.stringify(err) );
	}

} 

export class Relations {
	protected hasMany(_db: DB, ids: Array<string>, cb: (docs) => void, type?) {
		_db.find({ _id: { $in: ids }}, { limit: 1000 }, cb, type);
	}

	protected hasOne(_db: DB, id: string, cb: (doc) => void, type?) {
		_db.findById(id, cb, type);
	}
}
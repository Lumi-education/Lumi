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
	}

	public findById(_id: string, cb: (doc) => void, type?)  {
		request.get( db + _id )
		.then(res => {
			cb( type ? new type( res.body ) : res.body );
		})
		.catch(err => this.res.send(500).end(err) );
	}

	public save(doc) {
		request
		.put( db + doc._id )
		.send( doc )
		.then(res => {
			this.res.status(200).json( assign({}, doc, { _id: res.body.id, _rev: res.body.rev } ));
		})
		.catch(err => {
			this.res.status(500).end(err);
		});
	}

	public find(query, cb: (doc) => void, type?) {
		request.post( db + '_find' )
		.send({ selector: query })
		.then(res => {
			cb( type ? res.body.docs.forEach(d => new type(d)) : res.body.docs );
		})
		.catch(err => this.res.send(500).end(err) );
	}
} 
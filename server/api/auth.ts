import * as express from 'express';
import * as nano 	from 'nano';
import * as bcrypt 	from 'bcrypt-nodejs';
import * as jwt 	from 'jwt-simple';
import { auth, level } 	from '../core/auth';

import session 		from '../core/session';

export default function boot(server: express.Application, db: nano) {

	server.post('/api/auth/login', (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			if ( !req.body.password || !req.body.username ) { 
				res.status(400).end();
				return;
			 }

			db.view('user', 'username', { key: req.body.username }, (err, body) => {
				if (err) { res.status(err.statusCode).json(err); } else {
					if (body.rows.length === 0) { res.status(404).end(); } else {
						const user = body.rows[0].value;
						if (!bcrypt.compareSync(req.body.password, user.password)) { res.status(401).end(); } else {
							const date = new Date().getTime();

							db.insert({
								session_id: session.id,
								user_id: user.id,
								last_active: date,
								login: date,
								online: true,
								logout: null,
								query: {},
								type: 'session'
							}, (err, body) => { send_auth( user.id, session.id, user.level, res); });
							
						}
					}
					
				}
			});
		} catch (err) {
			res.status(501).json({
				code: 103,
				message: JSON.stringify(err)
			});
		}
	});

	server.post('/api/auth/logout', auth, level('student'), (
		req: express.Request, 
		res: express.Response, 
		next: express.NextFunction
	) => {
			db.view('user', 'session', { key: [ req.user._id, req.user.session_id ] }, (err, body) => {
				if (err) { res.status(500).json(err); return; }

				let session = body.rows[0].value;

				if (!session) { res.status(404).end('session not found'); return; }

				session.logout = new Date().getTime();
				session.online = false;
				db.insert(session, (err, body) => {
					if (err) { res.status(500).json(err); return; }

					res.status(200).end();
				})
			});
	});

	server.get('/api/auth/session_id', (req: express.Request, res: express.Response, next: express.NextFunction) => {
		res.status(200).json({ session_id: session.id });
	});

	server.put('/api/auth/session_id', auth, level('teacher'), (
		req: express.Request, 
		res: express.Response, 
		next: express.NextFunction
	) => {
			if (!req.body.session_id) { res.status(406).end(); } else {
				session.id = req.body.session_id;
				res.status(200).json( session.id );
			}
	});
	
	server.get('/api/auth/session', auth, (req: express.Request, res: express.Response, next: express.NextFunction) => {
		res.status(200).json(req.user);
	});

	server.post('/api/auth/register', (req: express.Request, res: express.Response, next: express.NextFunction) => {
		db.view('user', 'username', { key: req.body.username }, (err, body) => {
			if (body.rows.length > 0) { res.status(409).end(); } else { 
				db.insert({
					type: 'user',
					username: req.body.username,
					password: bcrypt.hashSync( req.body.password ),
					groups: ['tutorial_group'],
					level: 1
				},        (err, doc) => {
					if (err) { res.status(500).json(err); } else {
						res.status(201).json(doc);
					}
				});
			 }
		});
	});

}

function send_auth(user_id: string, session_id: string, level: number, res: express.Response): void {
	const jwt_token =
		jwt.encode({
			_id: user_id,
			session_id,
			level
		},         process.env.KEY);

	res.status(200).json({
		jwt_token,
		user_id,
		level
	});
}
import * as express 	from 'express';
import * as jwt 		from 'jwt-simple';

export default function jwt_decode(req: express.Request, res: express.Response, next: express.NextFunction) {
	const jwt_token = req.headers['x-auth'];

	if (jwt_token) {
		try {
			req['user'] = jwt.decode( jwt_token, process.env.KEY );
			next();
		} catch(err) {
			res.status(401).end();
		}
	} else {
		res.status(401).end();
	}
}
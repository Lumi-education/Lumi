import * as express 	from 'express';
import { Request } 		from '../../middleware/auth';

import Collection 		from '../../models/Collection';
import { DB } 				from '../../db';

export function get_test(req: Request, res: express.Response) {

	res.status(200).end('ok');
	
}
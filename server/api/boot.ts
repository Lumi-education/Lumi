import * as express from 'express';
import * as nano 	from 'nano';
import boot_assignments from './assignments';
import boot_collection 	from './collection';
import jwt 			from '../core/jwt';

export default function boot(server: express.Application, db: nano) {

	server.use(jwt);

	boot_assignments(server, db);
	boot_collection(server, db);
}
import * as express		from 'express';
import * as bodyParser	from 'body-parser';

const server: express.Application = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
	extended: true
}));

server.use(express.static( __dirname + '/../client'));

export default server;
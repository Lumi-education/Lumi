import * as _debug from 'debug';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';

import routes from '../routes';

const debug = _debug('server');

const server: express.Application = express();

server.use(bodyParser.json());
server.use(
    bodyParser.urlencoded({
        extended: true
    })
);

server.use(compression());

server.use(routes);

export default server;

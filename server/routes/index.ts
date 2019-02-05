import * as express from 'express';
import * as debug from 'debug';

import api_routes_v1 from './api/v1';
import static_routes from './static';
import h5p from 'h5p-nodejs-library/router';

import h5pinterface from '../integrations/h5p/h5pinterface';

const log = debug('lumi:routes');

export default function(): express.Router {
    log('start boot-sequence');
    const router = express.Router();

    router.use('/api/v1/:db/h5p', h5p(h5pinterface));
    router.use('/api/v1', api_routes_v1());
    router.use('/', static_routes);

    return router;
}

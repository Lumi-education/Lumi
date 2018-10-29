import * as express from 'express';
import * as debug from 'debug';

import api_routes_v0 from './api/v0';
import static_routes from './static';
import files_route from './files';
import docs_route from './docs';

const log = debug('lumi:routes');

export default function(): express.Router {
    log('start boot-sequence');
    const router = express.Router();

    router.use('/api/v0', api_routes_v0());
    router.use('/files', files_route);
    router.use('/docs', docs_route);
    router.use('/', static_routes);

    return router;
}

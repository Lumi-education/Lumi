import { Router } from 'express';

import api_routes from './api';
import static_routes from './static';
import files_route from './files';

const router = Router();

router.use('/api/v0', api_routes);
router.use('/api', api_routes);
router.use('/files', files_route);
router.use('/', static_routes);

export default router;

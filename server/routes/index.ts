import { Router } 						from 'express';

import api_routes						from './api';
import static_routes 					from './static';

const router = Router();

router.use('/api', api_routes);
router.use('/', static_routes);

export default router;
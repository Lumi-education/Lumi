import { Router } from 'express';

import controller from './controller';

const router = Router();

router.get('/install', controller.install);

export default router;

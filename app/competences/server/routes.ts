import { Router } from 'express';

import controller from './controller';

const router = Router();

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.read);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.put('/:id/action', controller.action);
export default router;

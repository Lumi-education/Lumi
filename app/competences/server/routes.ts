import { Router } from 'express';

import controller from './controller';

const router = Router();

router.get('/:db/competences', controller.list);
router.post('/:db/competences', controller.create);
router.get('/:db/competences/:id', controller.read);
router.put('/:db/competences/:id', controller.update);
router.delete('/:db/competences/:id', controller.delete);
router.put('/:db/competences/:id/action', controller.action);

export default router;

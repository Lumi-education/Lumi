import * as express from 'express';
import * as path from 'path';

const router = express.Router();

router.use(express.static(path.resolve('build/docs')));

export default router;

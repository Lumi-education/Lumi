import * as express from 'express';
import * as path from 'path';
import * as serveIndex from 'serve-index';

const router = express.Router();

router.use(
    express.static(path.resolve('files')),
    serveIndex(path.resolve('files'), { icons: true })
);

export default router;

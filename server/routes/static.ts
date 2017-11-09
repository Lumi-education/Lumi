import * as express from 'express';
import * as path from 'path';

const router = express.Router();

router.use(express.static(path.resolve('build/client')));

router.get('*', function(req, res) {
    res.sendFile(path.resolve('build/client/index.html'));
});

export default router;

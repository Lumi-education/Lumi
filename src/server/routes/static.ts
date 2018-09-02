import * as express from 'express';
import * as path from 'path';

const router = express.Router();

router.use(express.static(path.resolve('build/client')));

router.get('*', (req, res) => {
    res.render('index');
    // res.sendFile(path.resolve('build/client/index.html'));
});

export default router;

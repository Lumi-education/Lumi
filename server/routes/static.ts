import * as express from 'express';
import * as path from 'path';

const router = express.Router();

const static_path = path.join(__dirname, '..', '..', 'client');
router.use(express.static(static_path));

router.get('*', (req, res) => {
    res.render('index');
});

export default router;

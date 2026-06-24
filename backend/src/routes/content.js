const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/toolsController');

router.use(auth);

router.post('/generate',      c.generateContent);
router.post('/seo-optimize',  c.seoOptimize);

module.exports = router;

const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/toolsController');

router.use(auth);

// Engine 39: Translation
router.post('/text',        c.translateText);
router.post('/document',    c.translateDocument);
router.post('/chat',        c.translateChat);
router.post('/detect',      c.detectLanguage);
router.get('/languages',    c.getLanguages);

module.exports = router;

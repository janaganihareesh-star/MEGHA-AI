const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/toolsController');

router.use(auth);

router.post('/generate',    c.generatePrompt);
router.post('/optimize',    c.optimizePrompt);
router.post('/debug',       c.debugPrompt);
router.get('/templates',    c.getPromptTemplates);

module.exports = router;

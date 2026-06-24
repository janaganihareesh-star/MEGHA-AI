const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/toolsController');

router.use(auth);

router.post('/generate',    c.generateDraft);
router.get('/types',        c.getDraftTypes);

module.exports = router;

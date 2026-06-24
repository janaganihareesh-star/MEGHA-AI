const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/toolsController');

router.use(auth);

router.post('/',            c.calculate);
router.post('/formula',     c.explainFormula);
router.post('/practice',    c.practiceProblems);

module.exports = router;

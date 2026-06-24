const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/toolsController');

router.use(auth);

router.post('/assignment',  c.generateAssignment);
router.post('/report',      c.generateReport);
router.post('/ppt',         c.generatePPT);
router.post('/viva',        c.generateVivaQs);
router.post('/lab-record',  c.generateLabRecord);

module.exports = router;

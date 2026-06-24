const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/toolsController');

router.use(auth);

router.post('/idea',        c.getStartupIdeas);
router.post('/plan',        c.getBusinessPlan);
router.post('/pitch',       c.getPitchDeck);
router.post('/marketing',   c.getMarketingPlan);
router.post('/competitor',  c.getCompetitorAnalysis);

module.exports = router;

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/trend', profileController.getMoodTrend);
router.get('/analytics', profileController.getMoodAnalytics);
router.get('/history', profileController.getMoodHistory);

module.exports = router;

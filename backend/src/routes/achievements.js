const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const auth = require('../middleware/auth');

// Protect all achievements endpoints with JWT auth
router.use(auth);

router.post('/', achievementController.createAchievement);
router.get('/', achievementController.getAchievements);

module.exports = router;
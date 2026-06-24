const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pc = require('../controllers/productivityController');

router.use(auth);

// Planners
router.post('/daily-plan',  pc.generateDailyPlan);
router.post('/weekly-plan', pc.generateWeeklyPlan);
router.post('/study-plan',  pc.generateStudyPlan);

// Habits
router.get('/habits',                pc.getHabits);
router.post('/habits',               pc.createHabit);
router.put('/habits/:id/complete',   pc.completeHabit);
router.delete('/habits/:id',         pc.deleteHabit);
router.get('/habits/analytics',      pc.habitAnalytics);
router.post('/habits/coach',         pc.habitCoach);
router.post('/habits/suggest',       pc.suggestHabits);

module.exports = router;

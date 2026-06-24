const express = require('express');
const router = express.Router();
const weeklyReflectionController = require('../controllers/weeklyReflectionController');
const auth = require('../middleware/auth');

// Protect all weekly reflection endpoints with JWT auth
router.use(auth);

router.post('/', weeklyReflectionController.submitReflection);
router.get('/history', weeklyReflectionController.getHistory);

module.exports = router;

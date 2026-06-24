const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const auth = require('../middleware/auth');

// Protect all summary endpoints with JWT auth
router.use(auth);

router.get('/', summaryController.getSummary);
router.post('/generate', summaryController.generateMonthlySummary);

module.exports = router;

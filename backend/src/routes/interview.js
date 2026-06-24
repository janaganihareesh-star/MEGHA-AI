const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const auth = require('../middleware/auth');

// Protect all interview endpoints with JWT auth
router.use(auth);

router.post('/start', interviewController.startInterview);
router.post('/answer', interviewController.answerQuestion);
router.get('/result/:sessionId', interviewController.getResult);

module.exports = router;
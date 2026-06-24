const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');
const auth = require('../middleware/auth');

// Protect all learning endpoints with JWT auth
router.use(auth);

router.get('/roadmap/:subject', learningController.getRoadmap);
router.get('/topics/:subject', learningController.getTopics);
router.post('/ask', learningController.askQuestion);
router.post('/chat', learningController.chatTutor);
router.post('/question', learningController.getPracticeQuestion);
router.post('/evaluate', learningController.evaluateAnswer);
router.get('/progress', learningController.getProgress);

module.exports = router;
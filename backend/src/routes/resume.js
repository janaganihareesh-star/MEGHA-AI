const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/auth');

// Protect all resume endpoints with JWT auth
router.use(auth);

router.post('/upload', resumeController.resumeUploadMiddleware, resumeController.uploadResume);
router.post('/analyze', resumeController.analyzeResume);
router.get('/history', resumeController.getHistory);

module.exports = router;
const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');
const auth = require('../middleware/auth');

// Protect all voice endpoints with JWT auth
router.use(auth);

router.post('/upload', voiceController.audioUploadMiddleware, voiceController.uploadVoice);
router.post('/send', voiceController.sendVoice);
router.get('/history', voiceController.getVoiceHistory);
router.delete('/:id', voiceController.deleteVoiceConversation);

module.exports = router;
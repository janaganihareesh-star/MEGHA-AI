const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// Protect all profile endpoints with JWT auth
router.use(auth);

router.post('/language', profileController.setLanguage);
router.post('/ai-gender', profileController.setAiGender);
router.post('/voice', profileController.setVoice);
router.post('/relationship', profileController.setRelationship);
router.post('/ai-name', profileController.setAiName);
router.get('/preferences', profileController.getPreferences);
router.put('/preferences', profileController.updatePreferences);
router.put('/trusted-contacts', profileController.updateTrustedContacts);
router.put('/theme', profileController.updateTheme);

module.exports = router;
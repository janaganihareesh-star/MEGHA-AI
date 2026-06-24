const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/stats', profileController.getRelationshipStats);
router.get('/journey', profileController.getRelationshipJourney);

module.exports = router;

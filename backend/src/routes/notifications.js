const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Protect all notification endpoints with JWT auth
router.use(auth);

router.get('/', notificationController.getNotifications);
router.put('/read', notificationController.markRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
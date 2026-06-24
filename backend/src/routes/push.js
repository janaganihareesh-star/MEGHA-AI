const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PushSubscription = require('../models/PushSubscription');
const pushService = require('../services/pushService');

// GET /api/push/public-key
// Returns the VAPID public key to the frontend
router.get('/public-key', (req, res) => {
  res.json({ publicKey: pushService.publicKey });
});

// POST /api/push/subscribe
// Saves the subscription object from the frontend
router.post('/subscribe', auth, async (req, res) => {
  try {
    const subscription = req.body;
    const userId = req.user.id;

    // Check if subscription already exists for this user to avoid duplicates
    const existingSub = await PushSubscription.findOne({ 
      userId, 
      'subscription.endpoint': subscription.endpoint 
    });

    if (!existingSub) {
      await PushSubscription.create({ userId, subscription });
      console.log(`[Push OS] New subscription saved for user ${userId}`);
    }

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('[Push OS] Subscribe error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;

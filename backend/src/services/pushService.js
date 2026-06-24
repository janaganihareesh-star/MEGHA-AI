const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');

// VAPID keys should be generated once and stored in .env.
// If they don't exist, generate them for the session (development only).
let publicKey = process.env.VAPID_PUBLIC_KEY;
let privateKey = process.env.VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
  const vapidKeys = webpush.generateVAPIDKeys();
  publicKey = vapidKeys.publicKey;
  privateKey = vapidKeys.privateKey;
  console.log('[Push OS] Generated temporary VAPID Keys. Add these to .env for persistence:');
  console.log(`VAPID_PUBLIC_KEY=${publicKey}`);
  console.log(`VAPID_PRIVATE_KEY=${privateKey}`);
}

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  publicKey,
  privateKey
);

/**
 * Sends a push notification to all subscriptions of a user.
 */
async function sendPushNotification(userId, title, body) {
  const subscriptions = await PushSubscription.find({ userId });
  
  if (!subscriptions || subscriptions.length === 0) {
    console.log(`[Push OS] No push subscriptions found for user ${userId}`);
    return;
  }

  const payload = JSON.stringify({
    title,
    body,
    icon: '/icon.png' // Ensure you have an icon.png in frontend public folder
  });

  const promises = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(sub.subscription, payload);
      console.log(`[Push OS] Notification sent to user ${userId}`);
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription has expired or is no longer valid
        console.log('[Push OS] Subscription expired, removing...');
        await sub.deleteOne();
      } else {
        console.error('[Push OS] Error sending push notification:', err.message);
      }
    }
  });

  await Promise.all(promises);
}

module.exports = {
  sendPushNotification,
  publicKey
};

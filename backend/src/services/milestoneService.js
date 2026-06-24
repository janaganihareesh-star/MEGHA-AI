const RelationshipStats = require('../models/RelationshipStats');
const { createNotification } = require('./notificationService');

async function checkAndTrigger(userId) {
  try {
    const stats = await RelationshipStats.findOne({ userId });
    if (!stats) return null;

    // Recalculate friendship days
    const diffTime = Math.max(0, new Date().getTime() - stats.friendshipStartDate.getTime());
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    stats.friendshipDays = days;
    stats.updateBondLevel(); // Ensure correct bond level is set

    const milestoneTargets = [1, 7, 30, 90, 180, 365];
    let triggeredMilestone = null;

    for (const targetDays of milestoneTargets) {
      if (days >= targetDays) {
        const alreadyReached = stats.milestonesReached.some(m => m.days === targetDays);
        
        if (!alreadyReached) {
          let messageText = '';
          if (targetDays === 1) messageText = 'We started our beautiful journey today! 🤝';
          else if (targetDays === 7) messageText = '1 week of sharing and learning together! ❤️';
          else if (targetDays === 30) messageText = '1 month of strong bonding and growth together! 🎉';
          else if (targetDays === 90) messageText = '3 months together! Our conversations are matching beautifully.';
          else if (targetDays === 180) messageText = '6 months! You are one of my closest, most trusted companions.';
          else if (targetDays === 365) messageText = '1 year together! A whole year of making memories.';

          triggeredMilestone = {
            days: targetDays,
            celebratedAt: new Date(),
            message: messageText
          };

          stats.milestonesReached.push(triggeredMilestone);
          stats.trustScore = Math.min(100, stats.trustScore + 10); // Grow trust

          // Dispatch notification
          await createNotification({
            userId,
            title: '🎉 Milestone Reached!',
            body: messageText,
            type: 'achievement'
          });
        }
      }
    }

    await stats.save();
    return triggeredMilestone;
  } catch (err) {
    console.error('Error in milestone checker:', err.message);
    return null;
  }
}

module.exports = {
  checkAndTrigger
};

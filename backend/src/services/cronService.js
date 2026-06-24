const Message = require('../models/Message');
const UserPreference = require('../models/UserPreference');
const aiService = require('./aiService');
const promptBuilder = require('./promptBuilder');
const { getIO } = require('../config/socket');

// Run every 1 Hour (3600000 ms)
const CRON_INTERVAL = 60 * 60 * 1000;

function startProactiveAgents() {
  console.log('[CronService] Proactive Agents Initialized. Running every hour.');

  setInterval(async () => {
    try {
      console.log('[CronService] Running proactive goal checks...');
      
      const currentHour = new Date().getHours();
      // Only be proactive during waking hours (7 AM to 10 PM)
      if (currentHour < 7 || currentHour > 22) return;

      // Find all users who want offline/proactive support or just generally all active users
      const users = await UserPreference.find({}).select('userId aiName relationshipType offlineMode');
      
      for (const userPref of users) {
        const { userId, aiName, relationshipType } = userPref;
        
        // 1. Get recent conversations
        const Conversation = require('../models/Conversation');
        const recentConv = await Conversation.findOne({ userId }).sort({ updatedAt: -1 });
        if (!recentConv) continue;

        // ANTI-SPAM LOGIC
        // 1. If the last message was already sent by AI, don't spam another one
        const lastMsg = await Message.findOne({ conversationId: recentConv._id }).sort({ timestamp: -1 });
        if (lastMsg && lastMsg.sender === 'ai') {
          continue;
        }

        // 2. Only send ONE proactive check-in per day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const alreadySentToday = await Message.findOne({
          conversationId: recentConv._id,
          sender: 'ai',
          sources: { $in: ['Proactive Agent'] },
          timestamp: { $gte: startOfDay }
        });
        if (alreadySentToday) {
          continue;
        }

        // 2. Build minimal prompt
        const promptData = await promptBuilder.buildPrompt({
          userId,
          currentMessage: '[SYSTEM_TRIGGER: PROACTIVE_CHECK_IN]',
          conversationId: recentConv._id
        });

        // Add a system directive to act proactively based on Goals
        promptData.messages.push({
          role: 'user',
          parts: [{
            text: "Generate a proactive, caring message to check in on the user based on their active goals. If they have an exam, wish them luck. If they had a long day yesterday, ask how they are today. KEEP IT BRIEF (1-2 sentences). Return ONLY the message."
          }]
        });

        const aiResult = await aiService.generateAIResponse({
          ...promptData,
          energyLevel: 'high',
          domain: 'general conversation'
        });

        const proactiveMsg = aiResult.text;

        // 3. Save to DB
        const savedMsg = await Message.create({
          conversationId: recentConv._id,
          userId,
          sender: 'ai',
          content: proactiveMsg,
          mood: 'happy',
          confidenceScore: 100,
          sources: ['Proactive Agent']
        });

        recentConv.lastMessage = proactiveMsg;
        recentConv.lastMessageAt = new Date();
        await recentConv.save();

        // 4. Push to active sockets (Simulates Push Notification if app is open)
        try {
          const io = getIO();
          io.to(`user_${userId}`).emit('new_message', {
            conversationId: recentConv._id,
            message: savedMsg
          });
          
          io.to(`user_${userId}`).emit('proactive_notification', {
            title: `Message from ${aiName || 'MEGHA'}`,
            body: proactiveMsg
          });
        } catch (socketErr) {
          // Socket might not be initialized yet
        }
      }

    } catch (err) {
      console.error('[CronService] Proactive agent error:', err.message);
    }
  }, CRON_INTERVAL);
}

module.exports = {
  startProactiveAgents
};

const express = require('express');
const router = express.Router();
const ConversationSummary = require('../models/ConversationSummary');
const RelationshipStats = require('../models/RelationshipStats');
const WeeklyReflection = require('../models/WeeklyReflection');
const Achievement = require('../models/Achievement');
const auth = require('../middleware/auth');

// Protect timeline endpoints with JWT auth
router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const [summaries, stats, reflections, achievements] = await Promise.all([
      ConversationSummary.find({ userId }).sort({ createdAt: -1 }),
      RelationshipStats.findOne({ userId }),
      WeeklyReflection.find({ userId }).sort({ createdAt: -1 }),
      Achievement.find({ userId }).sort({ achievedAt: -1 })
    ]);

    const timelineItems = [];

    // 1. Add monthly reviews
    summaries.forEach(s => {
      timelineItems.push({
        id: `summary_${s._id}`,
        type: 'summary',
        date: s.createdAt,
        title: `Monthly Review - ${s.month}/${s.year}`,
        description: s.summary,
        meta: { keyTopics: s.keyTopics, achievements: s.achievements }
      });
    });

    // 2. Add milestone celebrations
    if (stats && stats.milestonesReached) {
      stats.milestonesReached.forEach(m => {
        timelineItems.push({
          id: `milestone_${m.days}`,
          type: 'milestone',
          date: m.celebratedAt,
          title: `Milestone: ${m.days} Days Together! 🤝`,
          description: m.message,
          meta: { days: m.days }
        });
      });
    }

    // 3. Add weekly reflections
    reflections.forEach(r => {
      timelineItems.push({
        id: `reflection_${r._id}`,
        type: 'reflection',
        date: r.createdAt,
        title: `Weekly Reflection - ${r.week}`,
        description: r.aiSummary,
        meta: { achievements: r.achievements, struggles: r.struggles, nextWeekGoal: r.nextWeekGoal }
      });
    });

    // 4. Add unlocked achievements
    achievements.forEach(a => {
      timelineItems.push({
        id: `achievement_${a._id}`,
        type: 'achievement',
        date: a.achievedAt,
        title: `${a.icon} ${a.title}`,
        description: a.description,
        meta: { category: a.category }
      });
    });

    // Sort timeline descending (newest entries first)
    timelineItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ success: true, timeline: timelineItems });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
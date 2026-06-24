const Achievement = require('../models/Achievement');

// POST /api/achievements (Manual unlock)
exports.createAchievement = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, category, icon } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const achievement = await Achievement.create({
      userId,
      title,
      description,
      category: category || 'goals',
      icon: icon || '🏆'
    });

    res.status(201).json({ success: true, achievement });
  } catch (err) {
    next(err);
  }
};

// GET /api/achievements
exports.getAchievements = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await Achievement.find({ userId }).sort({ achievedAt: -1 });
    res.status(200).json({ success: true, achievements: list });
  } catch (err) {
    next(err);
  }
};
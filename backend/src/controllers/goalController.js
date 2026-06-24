const axios = require('axios');
const Goal = require('../models/Goal');
const Achievement = require('../models/Achievement');
const DreamBoard = require('../models/DreamBoard');
const ImportantDate = require('../models/ImportantDate');

// ==========================================
// GOALS SECTION
// ==========================================

// POST /api/goals
exports.createGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, category, targetDate, steps } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Goal title is required.' });
    }

    const formattedSteps = steps ? steps.map(s => ({ step: s.step || s, done: !!s.done })) : [];

    const goal = await Goal.create({
      userId,
      title,
      description: description || '',
      category: category || 'general',
      targetDate,
      steps: formattedSteps
    });

    res.status(201).json({ success: true, goal });
  } catch (err) {
    next(err);
  }
};

// GET /api/goals
exports.getGoals = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [active, completed] = await Promise.all([
      Goal.find({ userId, isCompleted: false }).sort({ createdAt: -1 }),
      Goal.find({ userId, isCompleted: true }).sort({ completedAt: -1 })
    ]);

    res.status(200).json({ success: true, active, completed });
  } catch (err) {
    next(err);
  }
};

// PUT /api/goals/:id
exports.updateGoal = async (req, res, next) => {
  try {
    const goalId = req.params.id;
    const userId = req.user.id;
    const { title, description, progress, targetDate, steps, isCompleted } = req.body;

    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found or unauthorized.' });
    }

    if (title) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetDate !== undefined) goal.targetDate = targetDate;
    if (steps) {
      goal.steps = steps.map(s => ({ step: s.step, done: !!s.done }));
    }

    // Auto update progress if steps check state is updated manually
    if (steps && steps.length > 0) {
      const doneCount = steps.filter(s => !!s.done).length;
      goal.progress = Math.round((doneCount / steps.length) * 100);
    } else if (progress !== undefined) {
      goal.progress = progress;
    }

    // Automatic Achievement unlocking upon 100% completion
    if ((goal.progress === 100 || isCompleted === true) && !goal.isCompleted) {
      goal.isCompleted = true;
      goal.progress = 100;
      goal.completedAt = new Date();

      // Trigger achievement
      await Achievement.create({
        userId,
        title: `Goal Achieved: ${goal.title}`,
        description: `Successfully finished all steps for "${goal.title}"!`,
        category: goal.category,
        icon: '🎯'
      });
    } else if (goal.progress < 100 && isCompleted === false) {
      goal.isCompleted = false;
      goal.completedAt = undefined;
    }

    await goal.save();
    res.status(200).json({ success: true, goal });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/goals/:id
exports.deleteGoal = async (req, res, next) => {
  try {
    const goalId = req.params.id;
    const userId = req.user.id;

    const goal = await Goal.findOneAndDelete({ _id: goalId, userId });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found or unauthorized.' });
    }

    res.status(200).json({ success: true, message: 'Goal deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/goals/:id/breakdown (AI Breakdown)
exports.breakdownGoal = async (req, res, next) => {
  try {
    const goalId = req.params.id;
    const userId = req.user.id;

    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
      const mockSteps = [
        { step: 'Define the roadmap and timeline objectives.', done: false },
        { step: 'Learn fundamental syntax and core properties.', done: false },
        { step: 'Build simple practice files locally.', done: false },
        { step: 'Execute primary features coding implementation.', done: false },
        { step: 'Integrate styling layout designs.', done: false },
        { step: 'Run quality testing reviews.', done: false }
      ];
      goal.steps = mockSteps;
      goal.progress = 0;
      await goal.save();
      return res.status(200).json({ success: true, steps: mockSteps });
    }

    const systemPrompt = `Break down the goal "${goal.title}" (${goal.description}) into 5-8 progressive checklist steps.
Return ONLY JSON array matching: [{"step": "Step description text here"}]. Do not wrap in markdown code blocks.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{ role: 'user', parts: [{ text: 'Generate checklist steps' }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { temperature: 0.5, responseMimeType: 'application/json' }
    };

    const response = await axios.post(url, requestBody);
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    let steps = [];
    try {
      const parsed = JSON.parse(responseText);
      steps = parsed.map(item => ({ step: item.step, done: false }));
    } catch (err) {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      steps = parsed.map(item => ({ step: item.step, done: false }));
    }

    if (steps.length > 0) {
      goal.steps = steps;
      goal.progress = 0;
      await goal.save();
    }

    res.status(200).json({ success: true, steps: goal.steps });
  } catch (err) {
    console.error('Goal breakdown failed, using mock values:', err.message);
    const fallbackSteps = [
      { step: 'Setup local sandbox environment.', done: false },
      { step: 'Draft primary architectural specifications.', done: false },
      { step: 'Write core logic routines.', done: false },
      { step: 'Verify correct execution behaviors.', done: false }
    ];
    goal.steps = fallbackSteps;
    await goal.save();
    res.status(200).json({ success: true, steps: fallbackSteps });
  }
};

// ==========================================
// ACHIEVEMENTS SECTION
// ==========================================

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
      category: category || 'general',
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
    const achievements = await Achievement.find({ userId }).sort({ achievedAt: -1 });
    res.status(200).json({ success: true, achievements });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// DREAM BOARD SECTION
// ==========================================

// GET /api/dreamboard
exports.getDreams = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dreams = await DreamBoard.find({ userId }).sort({ isPinned: -1, createdAt: -1 });
    res.status(200).json({ success: true, dreams });
  } catch (err) {
    next(err);
  }
};

// POST /api/dreamboard
exports.createDream = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { dream, description, category, progress, targetYear } = req.body;

    if (!dream) {
      return res.status(400).json({ success: false, message: 'Dream text is required.' });
    }

    const newDream = await DreamBoard.create({
      userId,
      dream,
      description: description || '',
      category: category || 'life',
      progress: progress || 0,
      targetYear
    });

    res.status(201).json({ success: true, dream: newDream });
  } catch (err) {
    next(err);
  }
};

// PUT /api/dreamboard/:id
exports.updateDream = async (req, res, next) => {
  try {
    const dreamId = req.params.id;
    const userId = req.user.id;
    const updates = req.body;

    delete updates.userId;

    const updatedDream = await DreamBoard.findOneAndUpdate(
      { _id: dreamId, userId },
      { $set: updates },
      { new: true }
    );

    if (!updatedDream) {
      return res.status(404).json({ success: false, message: 'Dream not found or unauthorized.' });
    }

    res.status(200).json({ success: true, dream: updatedDream });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/dreamboard/:id
exports.deleteDream = async (req, res, next) => {
  try {
    const dreamId = req.params.id;
    const userId = req.user.id;

    const deleted = await DreamBoard.findOneAndDelete({ _id: dreamId, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Dream not found or unauthorized.' });
    }

    res.status(200).json({ success: true, message: 'Dream deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// IMPORTANT DATES SECTION
// ==========================================

// GET /api/dates
exports.getImportantDates = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dates = await ImportantDate.find({ userId }).sort({ date: 1 });
    res.status(200).json({ success: true, dates });
  } catch (err) {
    next(err);
  }
};

// POST /api/dates
exports.createImportantDate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, date, type, reminderEnabled } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: 'Title and Date are required.' });
    }

    const newDate = await ImportantDate.create({
      userId,
      title,
      date,
      type: type || 'event',
      reminderEnabled: reminderEnabled !== undefined ? reminderEnabled : true
    });

    res.status(201).json({ success: true, date: newDate });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/dates/:id
exports.deleteImportantDate = async (req, res, next) => {
  try {
    const dateId = req.params.id;
    const userId = req.user.id;

    const deleted = await ImportantDate.findOneAndDelete({ _id: dateId, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Date entry not found or unauthorized.' });
    }

    res.status(200).json({ success: true, message: 'Date entry deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
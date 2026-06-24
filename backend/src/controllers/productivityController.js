/**
 * productivityController.js
 * Section 109 — Productivity Engine: Daily Planner, Weekly Planner, Habit Tracker, Study Planner
 */

const axios = require('axios');
const UserPreference = require('../models/UserPreference');
const HabitTracker = require('../models/HabitTracker');
const Goal = require('../models/Goal');
const MoodLog = require('../models/MoodLog');

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    return { mock: true, message: 'Configure GEMINI_API_KEY in .env' };
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048, responseMimeType: 'application/json' }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. DAILY PLANNER
// POST /api/productivity/daily-plan
// ─────────────────────────────────────────────────────────────────────────────
exports.generateDailyPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date, goals, availableHours, priorities } = req.body;

    const pref = await UserPreference.findOne({ userId }).select('language').lean();
    const language = pref?.language || 'English';
    const lastMood = await MoodLog.findOne({ userId }).sort({ timestamp: -1 }).select('mood').lean();
    const mood = lastMood?.mood || 'neutral';

    const prompt = `Create a realistic time-blocked daily plan for ${date || 'today'}.
User goals: ${Array.isArray(goals) ? goals.join(', ') : (goals || 'productivity')}
Available hours: ${availableHours || 8}
Priorities today: ${Array.isArray(priorities) ? priorities.join(', ') : (priorities || 'work/study')}
User energy level: ${req.body.energyLevel || 'medium'}
Mood: ${mood}

Rules:
1. Time-block in 25-90 min chunks (Pomodoro-compatible)
2. Low energy → lighter tasks in evening, deep work in morning
3. Sad/anxious mood → include 1 wellness break minimum
4. Always include: morning routine, meals, breaks, wind-down
5. Deep work (coding/study): 90-min blocks, NO meetings during
6. Buffer time: 15-min buffer between tasks
7. End day by 10 PM

Return ONLY valid JSON:
{
  "date": "string",
  "blocks": [
    {
      "time": "09:00 - 10:30",
      "task": "string",
      "category": "deep_work|meeting|routine|break|social|health|learning",
      "priority": "high|medium|low",
      "tips": "string or null"
    }
  ],
  "dailyGoal": "string (1 motivating sentence for the day)",
  "warningNote": "string or null",
  "focusScore": 0
}
Language: ${language}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, plan: result, mood });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. WEEKLY PLANNER
// POST /api/productivity/weekly-plan
// ─────────────────────────────────────────────────────────────────────────────
exports.generateWeeklyPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { weekStart, monthlyGoals, workSchedule } = req.body;

    const pref = await UserPreference.findOne({ userId }).select('language').lean();
    const language = pref?.language || 'English';
    const activeGoals = await Goal.find({ userId, isCompleted: false }).limit(3).select('title progress').lean();
    const recentMoods = await MoodLog.find({ userId }).sort({ timestamp: -1 }).limit(7).select('mood').lean();
    const moodTrend = recentMoods.map(m => m.mood).join(', ') || 'neutral';

    const prompt = `Create a 7-day weekly plan starting ${weekStart || 'this Monday'}.
Monthly goals: ${monthlyGoals || 'achieve targets'}
Work schedule: ${workSchedule || '9 AM - 6 PM'}
Active goals from DB: ${activeGoals.map(g => `${g.title} (${g.progress}%)`).join(', ') || 'none yet'}
Current mood trend (last 7 days): ${moodTrend}

Design week as:
Monday-Wednesday: Heavy productive days (deep work, learning, coding)
Thursday-Friday:  Medium intensity (reviews, practice, networking)
Saturday:         Project work + skill building
Sunday:           Rest + planning next week + reflection

Return ONLY valid JSON:
{
  "weekTheme": "string (e.g. 'DSA Mastery Week')",
  "days": [
    {
      "day": "string",
      "date": "string",
      "intensity": "high|medium|low|rest",
      "focus": "string",
      "morningTask": "string",
      "afternoonTask": "string",
      "eveningTask": "string",
      "optionalTask": "string",
      "motivationQuote": "string"
    }
  ],
  "weeklyMilestone": "string",
  "checkInDays": []
}
Language: ${language}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, weeklyPlan: result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. STUDY PLANNER + EXAM COUNTDOWN
// POST /api/productivity/study-plan
// ─────────────────────────────────────────────────────────────────────────────
exports.generateStudyPlan = async (req, res, next) => {
  try {
    const { subject, examDate, currentLevel, dailyHours, topics } = req.body;
    const pref = await UserPreference.findOne({ userId: req.user.id }).select('language').lean();
    const language = pref?.language || 'English';

    const daysLeft = examDate
      ? Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24))
      : 30;

    const prompt = `Create a complete study plan for ${subject || 'General'} exam on ${examDate || 'in 30 days'}.
Current level: ${currentLevel || 'beginner'}. Daily hours: ${dailyHours || 3}.
Topics to cover: ${Array.isArray(topics) ? topics.join(', ') : (topics || 'all standard topics')}
Days remaining: ${daysLeft}

Distribute topics by:
- Weightage (exam frequency)
- Difficulty (hard → earlier, easier → revision phase)
- User current level (skip basics if intermediate/advanced)

Return ONLY valid JSON:
{
  "examName": "string",
  "daysLeft": ${daysLeft},
  "studyPlan": [
    {
      "weekNumber": 1,
      "theme": "string",
      "topics": [],
      "dailyTarget": "string",
      "practiceGoal": "string"
    }
  ],
  "lastWeekStrategy": "string",
  "examDayTips": [],
  "resources": [{ "topic": "", "resource": "", "free": true }],
  "redFlags": []
}
Language: ${language}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, studyPlan: result, daysLeft });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. HABIT TRACKER CRUD
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/habits
exports.getHabits = async (req, res, next) => {
  try {
    const habits = await HabitTracker.find({ userId: req.user.id, isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    // Compute completedToday and completionRate manually on lean objects
    const today = new Date().toDateString();
    const enriched = habits.map(h => ({
      ...h,
      completedToday: h.completedDates.some(d => new Date(d).toDateString() === today),
      completionRate: (() => {
        const ago = new Date(); ago.setDate(ago.getDate() - 30);
        const recent = h.completedDates.filter(d => new Date(d) >= ago).length;
        return Math.round((recent / 30) * 100);
      })()
    }));

    res.status(200).json({ success: true, habits: enriched });
  } catch (err) {
    next(err);
  }
};

// POST /api/habits
exports.createHabit = async (req, res, next) => {
  try {
    const { name, description, type, frequency, targetDays, reminderTime, category, color, icon } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Habit name is required.' });

    const habit = await HabitTracker.create({
      userId: req.user.id,
      name, description, type, frequency, targetDays, reminderTime, category, color, icon
    });

    res.status(201).json({ success: true, habit });
  } catch (err) {
    next(err);
  }
};

// PUT /api/habits/:id/complete — mark today complete
exports.completeHabit = async (req, res, next) => {
  try {
    const habit = await HabitTracker.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ success: false, message: 'Habit not found.' });

    const today = new Date().toDateString();
    const alreadyDone = habit.completedDates.some(d => new Date(d).toDateString() === today);

    if (!alreadyDone) {
      habit.completedDates.push(new Date());
      habit.streak += 1;
      if (habit.streak > habit.longestStreak) habit.longestStreak = habit.streak;
      await habit.save();
    }

    res.status(200).json({ success: true, habit, alreadyCompleted: alreadyDone });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/habits/:id
exports.deleteHabit = async (req, res, next) => {
  try {
    await HabitTracker.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false }
    );
    res.status(200).json({ success: true, message: 'Habit removed.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/habits/analytics
exports.habitAnalytics = async (req, res, next) => {
  try {
    const habits = await HabitTracker.find({ userId: req.user.id, isActive: true }).lean();
    const totalHabits = habits.length;
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    const longestEver = Math.max(...habits.map(h => h.longestStreak), 0);
    const today = new Date().toDateString();
    const completedToday = habits.filter(h =>
      h.completedDates.some(d => new Date(d).toDateString() === today)
    ).length;

    res.status(200).json({
      success: true,
      analytics: { totalHabits, completedToday, totalStreak, longestEver, habits }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/habits/coach — AI personalized recovery message
exports.habitCoach = async (req, res, next) => {
  try {
    const { habitId, missedDays } = req.body;
    const habit = await HabitTracker.findOne({ _id: habitId, userId: req.user.id }).lean();
    if (!habit) return res.status(404).json({ success: false, message: 'Habit not found.' });

    const pref = await UserPreference.findOne({ userId: req.user.id }).select('language aiName').lean();
    const language = pref?.language || 'English';
    const aiName = pref?.aiName || 'Maya';

    const prompt = `Generate a warm, personalized habit recovery message.
Habit: "${habit.name}" (${habit.category}, type: ${habit.type})
Days missed: ${missedDays || 2}
Previous streak: ${habit.streak}

RULES:
- Warm, supportive — NOT judgmental
- Acknowledge the miss briefly, focus on restart
- Give 1 specific tip for this habit type
- Keep it under 3 sentences
- Sound like ${aiName} the companion, not a coach

Return ONLY valid JSON:
{
  "message": "string",
  "tip": "string",
  "restartPlan": "string"
}
Language: ${language}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, coaching: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/habits/suggest — AI habit suggestions based on goals
exports.suggestHabits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pref = await UserPreference.findOne({ userId }).select('language').lean();
    const language = pref?.language || 'English';
    const activeGoals = await Goal.find({ userId, isCompleted: false }).limit(5).select('title').lean();
    const currentHabits = await HabitTracker.find({ userId, isActive: true }).select('name category').lean();

    const prompt = `Suggest 3 new habits based on user's goals.
Active goals: ${activeGoals.map(g => g.title).join(', ') || 'general productivity'}
Current habits (avoid duplicates): ${currentHabits.map(h => h.name).join(', ') || 'none'}

Return ONLY valid JSON:
{
  "suggestions": [
    {
      "name": "string",
      "reason": "string (why this habit helps their goals)",
      "category": "health|learning|career|mental|social|other",
      "frequency": "daily|weekdays|weekly",
      "targetDays": 66,
      "icon": "string (lucide icon name)"
    }
  ]
}
Language: ${language}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

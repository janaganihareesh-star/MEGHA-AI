const axios = require('axios');
const WeeklyReflection = require('../models/WeeklyReflection');

// POST /api/weekly-reflection
exports.submitReflection = async (req, res, next) => {
  try {
    const { week, achievements, struggles, lessons, nextWeekGoal } = req.body;
    const userId = req.user.id;

    if (!week) {
      return res.status(400).json({ success: false, message: 'Week parameter (e.g. YYYY-Www) is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let aiSummary = '';

    if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
      aiSummary = `Nanna/Bangaram, you did amazing work this week! Even though you faced struggles like "${struggles || 'challenges'}", you learned valuable lessons. Your goal for next week ("${nextWeekGoal || 'progress'}") is perfect. Keep going, I am right here with you!`;
    } else {
      const systemPrompt = `You are a supportive, warm, and wise companion.
Analyze the user's weekly reflection inputs:
Achievements: "${achievements}"
Struggles: "${struggles}"
Lessons: "${lessons}"
Next Week Goal: "${nextWeekGoal}"

Provide a warm, encouraging, 3-sentence summary of advice and support. Do not add formatting like headers.`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [{ role: 'user', parts: [{ text: 'Summarize weekly progress' }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature: 0.7 }
      };

      try {
        const response = await axios.post(url, requestBody);
        aiSummary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        aiSummary = aiSummary.trim();
      } catch (geminiErr) {
        console.error('Weekly reflection Gemini call failed, using mock response:', geminiErr.message);
        aiSummary = 'Keep up the good work ra. Every effort is a step closer to your goals.';
      }
    }

    const reflection = await WeeklyReflection.create({
      userId,
      week,
      achievements: achievements || '',
      struggles: struggles || '',
      lessons: lessons || '',
      nextWeekGoal: nextWeekGoal || '',
      aiSummary
    });

    res.status(201).json({ success: true, reflection });
  } catch (err) {
    next(err);
  }
};

// GET /api/weekly-reflection/history
exports.getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await WeeklyReflection.find({ userId }).sort({ week: -1 });
    res.status(200).json({ success: true, history });
  } catch (err) {
    next(err);
  }
};